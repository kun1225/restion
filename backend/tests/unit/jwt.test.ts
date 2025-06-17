import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  revokeAccessToken,
  revokeRefreshToken,
  isTokenRevoked,
  revokeAllUserTokens,
} from '../../src/utils/jwt';
import { TestDbHelper } from '../helpers/testDb';
import { db } from '../../src/utils/db';

describe('JWT Utils', () => {
  let testUser: any;

  beforeEach(async () => {
    await TestDbHelper.cleanupAll();
    testUser = await TestDbHelper.createTestUser();
  });

  afterEach(async () => {
    await TestDbHelper.cleanupAll();
  });

  describe('generateTokens', () => {
    it('should generate valid access and refresh tokens', async () => {
      const tokens = await generateTokens(testUser.id);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('should store refresh token in database', async () => {
      const tokens = await generateTokens(testUser.id);

      const refreshTokenRecord = await db('refresh_tokens')
        .where('user_id', testUser.id)
        .first();

      expect(refreshTokenRecord).toBeDefined();
      expect(refreshTokenRecord.user_id).toBe(testUser.id);
    });

    it('should store device info when provided', async () => {
      const deviceInfo = { userAgent: 'test-browser', ip: '127.0.0.1' };
      await generateTokens(testUser.id, deviceInfo);

      const refreshTokenRecord = await db('refresh_tokens')
        .where('user_id', testUser.id)
        .first();

      expect(refreshTokenRecord.device_info).toBe(JSON.stringify(deviceInfo));
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', async () => {
      const tokens = await generateTokens(testUser.id);
      const decoded = verifyAccessToken(tokens.accessToken);

      expect(decoded).toHaveProperty('sub', testUser.id);
      expect(decoded).toHaveProperty('type', 'access');
      expect(decoded).toHaveProperty('jti');
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for non-access token type', async () => {
      // 這裡我們需要手動創建一個非 access 類型的 token 來測試
      const jwt = require('jsonwebtoken');
      const fakeToken = jwt.sign(
        { sub: testUser.id, type: 'refresh', jti: 'test' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
      );

      expect(() => {
        verifyAccessToken(fakeToken);
      }).toThrow('Invalid token type');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', async () => {
      const tokens = await generateTokens(testUser.id);
      const result = await verifyRefreshToken(tokens.refreshToken);

      expect(result).toHaveProperty('userId', testUser.id);
      expect(result).toHaveProperty('tokenHash');
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(verifyRefreshToken('invalid_token')).rejects.toThrow();
    });

    it('should throw error for revoked refresh token', async () => {
      const tokens = await generateTokens(testUser.id);

      // 撤銷 token
      const { tokenHash } = await verifyRefreshToken(tokens.refreshToken);
      await revokeRefreshToken(tokenHash);

      // 嘗試再次驗證應該失敗
      await expect(verifyRefreshToken(tokens.refreshToken)).rejects.toThrow();
    });

    it('should throw error for expired refresh token', async () => {
      // 創建一個已過期的 refresh token
      const expiredDate = new Date(Date.now() - 1000); // 1 秒前過期
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate,
        token_hash: 'expired_token_hash',
      });

      await expect(verifyRefreshToken('expired_token')).rejects.toThrow();
    });
  });

  describe('revokeAccessToken', () => {
    it('should add access token to revoked list', async () => {
      const tokens = await generateTokens(testUser.id);
      const decoded = verifyAccessToken(tokens.accessToken);

      await revokeAccessToken(decoded.jti, testUser.id);

      const revokedToken = await db('revoked_tokens')
        .where('jti', decoded.jti)
        .first();

      expect(revokedToken).toBeDefined();
      expect(revokedToken.user_id).toBe(testUser.id);
    });
  });

  describe('isTokenRevoked', () => {
    it('should return false for non-revoked token', async () => {
      const tokens = await generateTokens(testUser.id);
      const decoded = verifyAccessToken(tokens.accessToken);

      const isRevoked = await isTokenRevoked(decoded.jti);
      expect(isRevoked).toBe(false);
    });

    it('should return true for revoked token', async () => {
      const tokens = await generateTokens(testUser.id);
      const decoded = verifyAccessToken(tokens.accessToken);

      await revokeAccessToken(decoded.jti, testUser.id);

      const isRevoked = await isTokenRevoked(decoded.jti);
      expect(isRevoked).toBe(true);
    });
  });

  describe('revokeRefreshToken', () => {
    it('should mark refresh token as revoked', async () => {
      const tokens = await generateTokens(testUser.id);
      const { tokenHash } = await verifyRefreshToken(tokens.refreshToken);

      await revokeRefreshToken(tokenHash);

      const refreshTokenRecord = await db('refresh_tokens')
        .where('token_hash', tokenHash)
        .first();

      expect(refreshTokenRecord.revoked_at).not.toBeNull();
    });
  });

  describe('revokeAllUserTokens', () => {
    it('should revoke all user refresh tokens', async () => {
      // 創建多個 refresh tokens
      await generateTokens(testUser.id);
      await generateTokens(testUser.id);
      await generateTokens(testUser.id);

      await revokeAllUserTokens(testUser.id);

      const activeTokens = await db('refresh_tokens')
        .where('user_id', testUser.id)
        .whereNull('revoked_at');

      expect(activeTokens).toHaveLength(0);
    });
  });
});

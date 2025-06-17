import {
  cleanupExpiredTokens,
  cleanupUserExpiredTokens,
  cleanupRevokedExpiredTokens,
  getTokenStats,
} from '../../src/utils/cleanup';
import { TestDbHelper } from '../helpers/testDb';
import { generateTokens, revokeAccessToken } from '../../src/utils/jwt';
import { db } from '../../src/utils/db';

describe('Cleanup Utils', () => {
  let testUser: any;

  beforeEach(async () => {
    await TestDbHelper.cleanupAll();
    testUser = await TestDbHelper.createTestUser();
  });

  afterEach(async () => {
    await TestDbHelper.cleanupAll();
  });

  describe('cleanupExpiredTokens', () => {
    it('should clean up expired refresh tokens', async () => {
      // 創建過期的 refresh token
      const expiredDate = new Date(Date.now() - 1000); // 1 秒前過期
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate,
      });

      // 創建未過期的 refresh token
      const futureDate = new Date(Date.now() + 60000); // 1 分鐘後過期
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: futureDate,
      });

      await cleanupExpiredTokens();

      const remainingTokens = await db('refresh_tokens').select();
      expect(remainingTokens).toHaveLength(1);
      expect(new Date(remainingTokens[0].expires_at).getTime()).toBeGreaterThan(
        Date.now(),
      );
    });

    it('should clean up expired revoked tokens', async () => {
      // 創建過期的 revoked token
      const expiredDate = new Date(Date.now() - 1000);
      await TestDbHelper.createTestRevokedToken(testUser.id, 'expired-jti', {
        expires_at: expiredDate,
      });

      // 創建未過期的 revoked token
      const futureDate = new Date(Date.now() + 60000);
      await TestDbHelper.createTestRevokedToken(testUser.id, 'valid-jti', {
        expires_at: futureDate,
      });

      await cleanupExpiredTokens();

      const remainingTokens = await db('revoked_tokens').select();
      expect(remainingTokens).toHaveLength(1);
      expect(remainingTokens[0].jti).toBe('valid-jti');
    });
  });

  describe('cleanupUserExpiredTokens', () => {
    it('should clean up expired tokens for specific user only', async () => {
      const anotherUser = await TestDbHelper.createTestUser();

      // 為測試用戶創建過期 token
      const expiredDate = new Date(Date.now() - 1000);
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate,
      });

      // 為另一個用戶創建過期 token
      await TestDbHelper.createTestRefreshToken(anotherUser.id, {
        expires_at: expiredDate,
      });

      await cleanupUserExpiredTokens(testUser.id);

      const remainingTokens = await db('refresh_tokens').select();
      expect(remainingTokens).toHaveLength(1);
      expect(remainingTokens[0].user_id).toBe(anotherUser.id);
    });
  });

  describe('cleanupRevokedExpiredTokens', () => {
    it('should clean up revoked and expired refresh tokens', async () => {
      // 創建已撤銷且過期的 token
      const expiredDate = new Date(Date.now() - 1000);
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate,
        revoked_at: new Date(),
      });

      // 創建已撤銷但未過期的 token
      const futureDate = new Date(Date.now() + 60000);
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: futureDate,
        revoked_at: new Date(),
      });

      // 創建未撤銷且過期的 token
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate,
        revoked_at: null,
      });

      await cleanupRevokedExpiredTokens();

      const remainingTokens = await db('refresh_tokens').select();
      expect(remainingTokens).toHaveLength(2); // 只有已撤銷且過期的會被清理
    });
  });

  describe('getTokenStats', () => {
    it('should return correct token statistics', async () => {
      // 創建各種類型的 tokens 進行統計測試
      const expiredDate = new Date(Date.now() - 1000);
      const futureDate = new Date(Date.now() + 60000);

      // 創建 refresh tokens
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: futureDate, // 有效的
      });
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: expiredDate, // 過期的
      });
      await TestDbHelper.createTestRefreshToken(testUser.id, {
        expires_at: futureDate,
        revoked_at: new Date(), // 已撤銷但未過期
      });

      // 創建 revoked access tokens
      await TestDbHelper.createTestRevokedToken(testUser.id, 'jti1', {
        expires_at: futureDate, // 有效的
      });
      await TestDbHelper.createTestRevokedToken(testUser.id, 'jti2', {
        expires_at: expiredDate, // 過期的
      });

      const stats = await getTokenStats();

      expect(stats.totalRefreshTokens).toBe(3);
      expect(stats.expiredRefreshTokens).toBe(1);
      expect(stats.revokedRefreshTokens).toBe(1);
      expect(stats.totalRevokedAccessTokens).toBe(2);
      expect(stats.expiredRevokedAccessTokens).toBe(1);
    });

    it('should return zero stats when no tokens exist', async () => {
      const stats = await getTokenStats();

      expect(stats.totalRefreshTokens).toBe(0);
      expect(stats.expiredRefreshTokens).toBe(0);
      expect(stats.revokedRefreshTokens).toBe(0);
      expect(stats.totalRevokedAccessTokens).toBe(0);
      expect(stats.expiredRevokedAccessTokens).toBe(0);
    });
  });
});

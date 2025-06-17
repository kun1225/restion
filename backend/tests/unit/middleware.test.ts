import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../src/middleware/auth';
import { generateTokens, revokeAccessToken } from '../../src/utils/jwt';
import { TestDbHelper } from '../helpers/testDb';

// Mock 類型
interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

interface MockRequest extends Partial<Request> {
  headers: { authorization?: string };
  user?: any;
  tokenId?: string;
}

describe('Authentication Middleware', () => {
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: NextFunction;
  let testUser: any;

  beforeEach(async () => {
    await TestDbHelper.cleanupAll();
    testUser = await TestDbHelper.createTestUser();

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(async () => {
    await TestDbHelper.cleanupAll();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and set user info', async () => {
      const tokens = await generateTokens(testUser.id);
      mockReq.headers.authorization = `Bearer ${tokens.accessToken}`;

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user?.id).toBe(testUser.id);
      expect(mockReq.user?.email).toBe(testUser.email);
      expect(mockReq.tokenId).toBeDefined();
    });

    it('should reject request without token', async () => {
      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No token provided' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', async () => {
      mockReq.headers.authorization = 'InvalidFormat';

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with malformed token', async () => {
      mockReq.headers.authorization = 'Bearer invalid.token.here';

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject revoked token', async () => {
      const tokens = await generateTokens(testUser.id);

      // 先設置有效的 token
      mockReq.headers.authorization = `Bearer ${tokens.accessToken}`;

      // 驗證 token 以獲取 jti
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(
        tokens.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );

      // 撤銷 token
      await revokeAccessToken(decoded.jti, testUser.id);

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject token for non-existent user', async () => {
      // 創建一個不存在用戶的 token
      const jwt = require('jsonwebtoken');
      const fakeToken = jwt.sign(
        { sub: 99999, type: 'access', jti: 'fake-jti' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
      );

      mockReq.headers.authorization = `Bearer ${fakeToken}`;

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive',
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle expired token', async () => {
      // 創建一個已過期的 token
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { sub: testUser.id, type: 'access', jti: 'expired-jti' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '-1s' }, // 已過期
      );

      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      await authenticateToken(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle different authorization header formats', async () => {
      const tokens = await generateTokens(testUser.id);

      // 測試不同的格式
      const testCases = [
        `Bearer ${tokens.accessToken}`, // 正確格式
        `bearer ${tokens.accessToken}`, // 小寫 bearer
        tokens.accessToken, // 只有 token
      ];

      for (const authHeader of testCases) {
        jest.clearAllMocks();
        mockReq.headers.authorization = authHeader;

        await authenticateToken(
          mockReq as Request,
          mockRes as Response,
          mockNext,
        );

        if (authHeader.toLowerCase().startsWith('bearer ')) {
          expect(mockNext).toHaveBeenCalled();
        } else {
          expect(mockRes.status).toHaveBeenCalledWith(401);
        }
      }
    });
  });
});

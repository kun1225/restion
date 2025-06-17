import { db } from '../../src/utils/db';

export class TestDbHelper {
  // 清理所有測試表
  static async cleanupAll(): Promise<void> {
    await db.raw('TRUNCATE TABLE refresh_tokens RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE revoked_tokens RESTART IDENTITY CASCADE');
    await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  }

  // 清理用戶相關數據
  static async cleanupUser(userId: number): Promise<void> {
    await db('refresh_tokens').where('user_id', userId).del();
    await db('revoked_tokens').where('user_id', userId).del();
    await db('users').where('id', userId).del();
  }

  // 創建測試用戶
  static async createTestUser(overrides: Partial<any> = {}): Promise<any> {
    const defaultUser = {
      email: `test_${Date.now()}@example.com`,
      username: `test_user_${Date.now()}`,
      password_hash: '$2b$10$test.hash.for.testing.purposes.only',
      ...overrides,
    };

    const [user] = await db('users').insert(defaultUser).returning('*');
    return user;
  }

  // 創建測試 refresh token
  static async createTestRefreshToken(
    userId: number,
    overrides: Partial<any> = {},
  ): Promise<any> {
    const defaultToken = {
      user_id: userId,
      token_hash: `test_hash_${Date.now()}`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ...overrides,
    };

    const [token] = await db('refresh_tokens')
      .insert(defaultToken)
      .returning('*');
    return token;
  }

  // 創建測試 revoked token
  static async createTestRevokedToken(
    userId: number,
    jti: string,
    overrides: Partial<any> = {},
  ): Promise<any> {
    const defaultRevokedToken = {
      jti,
      user_id: userId,
      expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      ...overrides,
    };

    const [token] = await db('revoked_tokens')
      .insert(defaultRevokedToken)
      .returning('*');
    return token;
  }

  // 檢查資料庫連接
  static async checkConnection(): Promise<boolean> {
    try {
      await db.raw('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
}

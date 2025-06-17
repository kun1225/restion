import { db } from './db';

export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const deletedRevokedTokens = await db('revoked_tokens')
      .where('expires_at', '<', new Date())
      .del();

    const deletedRefreshTokens = await db('refresh_tokens')
      .where('expires_at', '<', new Date())
      .del();

    console.log(
      `Cleanup completed: ${deletedRevokedTokens} revoked tokens, ${deletedRefreshTokens} refresh tokens deleted`,
    );
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
};

export const cleanupUserExpiredTokens = async (
  userId: number,
): Promise<void> => {
  try {
    const deleted = await db('refresh_tokens')
      .where('user_id', userId)
      .where('expires_at', '<', new Date())
      .del();

    console.log(
      `Cleanup for user ${userId}: ${deleted} expired refresh tokens deleted`,
    );
  } catch (error) {
    console.error(
      `Failed to cleanup expired tokens for user ${userId}:`,
      error,
    );
  }
};

export const cleanupRevokedExpiredTokens = async (): Promise<void> => {
  try {
    const deleted = await db('refresh_tokens')
      .whereNotNull('revoked_at')
      .where('expires_at', '<', new Date())
      .del();

    console.log(
      `Cleanup revoked tokens: ${deleted} revoked and expired refresh tokens deleted`,
    );
  } catch (error) {
    console.error('Failed to cleanup revoked expired tokens:', error);
  }
};

// Start periodic cleanup task
export const startCleanupScheduler = (): void => {
  const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

  setInterval(async () => {
    console.log('Starting scheduled token cleanup...');
    await cleanupExpiredTokens();
    await cleanupRevokedExpiredTokens();
  }, CLEANUP_INTERVAL);

  console.log('Token cleanup scheduler started (runs every hour)');
};

export const getTokenStats = async (): Promise<{
  totalRefreshTokens: number;
  expiredRefreshTokens: number;
  revokedRefreshTokens: number;
  totalRevokedAccessTokens: number;
  expiredRevokedAccessTokens: number;
}> => {
  try {
    const [
      totalRefreshTokens,
      expiredRefreshTokens,
      revokedRefreshTokens,
      totalRevokedAccessTokens,
      expiredRevokedAccessTokens,
    ] = await Promise.all([
      db('refresh_tokens')
        .count('* as count')
        .first()
        .then((r) => Number(r?.count || 0)),
      db('refresh_tokens')
        .where('expires_at', '<', new Date())
        .count('* as count')
        .first()
        .then((r) => Number(r?.count || 0)),
      db('refresh_tokens')
        .whereNotNull('revoked_at')
        .count('* as count')
        .first()
        .then((r) => Number(r?.count || 0)),
      db('revoked_tokens')
        .count('* as count')
        .first()
        .then((r) => Number(r?.count || 0)),
      db('revoked_tokens')
        .where('expires_at', '<', new Date())
        .count('* as count')
        .first()
        .then((r) => Number(r?.count || 0)),
    ]);

    return {
      totalRefreshTokens,
      expiredRefreshTokens,
      revokedRefreshTokens,
      totalRevokedAccessTokens,
      expiredRevokedAccessTokens,
    };
  } catch (error) {
    console.error('Failed to get token stats:', error);
    throw error;
  }
};

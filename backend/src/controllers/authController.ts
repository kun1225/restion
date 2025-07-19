import type { ApiResponse, User } from '@restion/shared';
import { ERROR_CODES } from '@restion/shared';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUser, findByEmail, findById } from '../models/User';
import { hashPassword } from '../utils/hash';
import {
  generateTokens,
  revokeAccessToken,
  revokeAllUserTokens,
  revokeRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

export async function registerController(
  req: Request,
  res: Response<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  >,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: ERROR_CODES.MISSING_FIELDS,
          message: 'Missing required fields',
        },
      });
      return;
    }

    const existing = await findByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: ERROR_CODES.EMAIL_ALREADY_REGISTERED,
          message: 'Email already registered',
        },
      });
      return;
    }

    const username = email.split('@')[0];
    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      email,
      username,
      password_hash: hashedPassword,
    });

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: `Internal server error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
    });
  }
}

export async function loginController(
  req: Request,
  res: Response<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  >,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: ERROR_CODES.MISSING_FIELDS,
          message: 'Email and password are required',
        },
      });
      return;
    }

    const user = await findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_CREDENTIALS,
          message: 'Invalid email or password',
        },
      });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_CREDENTIALS,
          message: 'Invalid email or password',
        },
      });
      return;
    }

    // 生成 tokens
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      deviceInfo,
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Login failed',
      },
    });
  }
}

export async function refreshTokenController(
  req: Request,
  res: Response<ApiResponse<{ accessToken: string; refreshToken: string }>>,
) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.NO_TOKEN,
          message: 'No refresh token provided',
        },
      });
      return;
    }

    const { userId, tokenHash } = await verifyRefreshToken(refreshToken);

    await revokeRefreshToken(tokenHash);

    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      userId,
      deviceInfo,
    );

    res.json({
      success: true,
      message: 'Tokens refreshed',
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_REFRESH_TOKEN,
        message: 'Invalid or expired refresh token',
      },
    });
  }
}

export async function logoutController(
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
) {
  try {
    const { refreshToken } = req.body;

    // 如果有 access token，撤銷它
    if (req.user && req.tokenId) {
      await revokeAccessToken(req.tokenId, req.user.id);
    }

    // 如果有 refresh token，撤銷它
    if (refreshToken) {
      try {
        const { tokenHash } = await verifyRefreshToken(refreshToken);
        await revokeRefreshToken(tokenHash);
      } catch (error) {
        // 如果 refresh token 已經無效，忽略錯誤
        console.log('Refresh token already invalid:', error);
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
      data: { message: 'You have been logged out' },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Logout failed',
      },
    });
  }
}

export async function logoutAllController(
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.NO_TOKEN,
          message: 'Authentication required',
        },
      });
      return;
    }

    // 撤銷用戶的所有 tokens
    await revokeAllUserTokens(req.user.id);

    // 撤銷當前的 access token
    if (req.tokenId) {
      await revokeAccessToken(req.tokenId, req.user.id);
    }

    res.json({
      success: true,
      message: 'Logged out from all devices',
      data: { message: 'You have been logged out from all devices' },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Logout all failed',
      },
    });
  }
}

export async function getMeController(
  req: Request,
  res: Response<ApiResponse<{ user: User }>>,
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: ERROR_CODES.NO_TOKEN,
          message: 'Authentication required',
        },
      });
      return;
    }

    const user = await findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: ERROR_CODES.USER_NOT_FOUND, message: 'User not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Failed to get user info',
      },
    });
  }
}

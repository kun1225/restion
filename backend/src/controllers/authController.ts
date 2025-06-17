import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findByEmail, createUser, findById } from '../models/User';
import { hashPassword } from '../utils/hash';
import {
  generateTokens,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAccessToken,
  revokeAllUserTokens,
} from '../utils/jwt';
import type { ApiResponse, User } from '../types';
import { ERROR_CODES } from '../types/apiResponse';

export async function registerController(
  req: Request,
  res: Response<ApiResponse<{ user: User; accessToken: string }>>,
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

    // 生成 tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);

    // 設置 httpOnly cookie 存儲 refresh token
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    res.status(201).json({
      success: true,
      message: 'User registered',
      data: { user, accessToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    });
  }
}

export async function loginController(
  req: Request,
  res: Response<ApiResponse<{ user: User; accessToken: string }>>,
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

    // 設置 httpOnly cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken },
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
  res: Response<ApiResponse<{ accessToken: string }>>,
) {
  try {
    const refreshToken = req.cookies.refresh_token;

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

    // 驗證 refresh token
    const { userId, tokenHash } = await verifyRefreshToken(refreshToken);

    // 撤銷舊的 refresh token (token rotation)
    await revokeRefreshToken(tokenHash);

    // 生成新的 tokens
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      userId,
      deviceInfo,
    );

    // 設置新的 refresh token cookie
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    res.json({
      success: true,
      message: 'Tokens refreshed',
      data: { accessToken },
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
    const refreshToken = req.cookies.refresh_token;

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

    // 清除 cookie
    res.clearCookie('refresh_token');

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

    // 清除 cookie
    res.clearCookie('refresh_token');

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

    // 從資料庫獲取最新的用戶信息
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

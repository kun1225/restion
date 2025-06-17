import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, isTokenRevoked } from '../utils/jwt';
import { findById } from '../models/User';
import type { ApiResponse } from '../types';

// Extend Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
      };
      tokenId?: string;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No token provided' },
      });
      return;
    }

    const decoded = verifyAccessToken(token);

    const revoked = await isTokenRevoked(decoded.jti);
    if (revoked) {
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked' },
      });
      return;
    }

    const user = await findById(decoded.sub);
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive',
        },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    req.tokenId = decoded.jti;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
        });
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication error',
      },
    });
  }
};

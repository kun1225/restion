import { Request, Response } from 'express';
import { findByEmail, createUser } from '../models/User';
import { hashPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import type { ApiResponse, User } from '../types';

export async function registerController(
  req: Request,
  res: Response<ApiResponse<{ user: User; token: string }>>,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Missing required fields' },
      });

      return;
    }

    const existing = await findByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_REGISTERED',
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
    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'User registered',
      data: { user, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    });
  }
}

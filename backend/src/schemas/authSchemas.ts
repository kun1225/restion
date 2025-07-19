import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.email({ pattern: z.regexes.html5Email }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be less than 64 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

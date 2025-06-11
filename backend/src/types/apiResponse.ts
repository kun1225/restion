export type ApiResponse<T = any> =
  | {
      success: true;
      message?: string;
      data?: T;
    }
  | {
      success: false;
      error: {
        code: ErrorCode;
        message: ErrorMessage | string;
      };
    };

export const ERROR_CODES = {
  MISSING_FIELDS: 'MISSING_FIELDS',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

type ErrorCode = keyof typeof ERROR_CODES;

export const ERROR_MESSAGES = {
  [ERROR_CODES.MISSING_FIELDS]: 'Missing required fields',
  [ERROR_CODES.EMAIL_ALREADY_REGISTERED]: 'Email already registered',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
} as const;

type ErrorMessage = (typeof ERROR_MESSAGES)[ErrorCode];

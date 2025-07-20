// import type { ApiResponse, RegisterResponse } from '@restion/shared';

// export default defineEventHandler(async (event) => {
//   const { email, password, confirmPassword } = await readBody(event);

//   if (!email || !password || !confirmPassword) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: '沒有輸入 email 或 password 或 confirmPassword',
//     });
//   }

//   const runtimeConfig = useRuntimeConfig();

//   try {
//     const response = await fetch(
//       `${runtimeConfig.public.backendUrl}/api/auth/register`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         method: 'POST',
//         body: JSON.stringify({ email, password, confirmPassword }),
//       },
//     );

//     const data = (await response.json()) as ApiResponse<RegisterResponse>;

//     if (data?.success) {
//       const { user, accessToken, refreshToken } = data.data!;

//       setCookie(event, 'access_token', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 1 * 60 * 60 * 1000, // 1 hour
//       });

//       setCookie(event, 'refresh_token', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       });

//       return { user };
//     }

//     throw createError({
//       statusCode: 400,
//       statusMessage: data.error.message,
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw createError({
//         statusCode: 500,
//         statusMessage: error.message || '註冊失敗',
//       });
//     }
//   }
// });

import {
  ERROR_CODES,
  type ApiResponse,
  type User,
  type RegisterResponse,
} from '@restion/shared';

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  const { email, password, confirmPassword } = await readBody(event);

  if (!email || !password || !confirmPassword) {
    return {
      success: false,
      error: {
        code: ERROR_CODES.MISSING_FIELDS,
        message: '沒有輸入 email 或 password 或 confirmPassword',
      },
    };
  }

  const runtimeConfig = useRuntimeConfig();

  try {
    const response = await fetch(
      `${runtimeConfig.public.backendUrl}/api/auth/register`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email, password, confirmPassword }),
      },
    );

    const data = (await response.json()) as ApiResponse<RegisterResponse>;

    if (data.success) {
      const { user, accessToken, refreshToken } = data.data!;

      setCookie(event, 'access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      });

      setCookie(event, 'refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        success: true,
        message: data.message,
        data: user,
      };
    }

    return {
      success: false,
      error: {
        code: data.error.code,
        message: data.error.message,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message:
          error instanceof Error ? error.message : '註冊失敗，請稍後再試',
      },
    };
  }
});

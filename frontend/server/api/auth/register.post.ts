import type { ApiResponse, RegisterResponse } from '@restion/shared';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '沒有輸入 email 或 password',
    });
  }

  const runtimeConfig = useRuntimeConfig();

  try {
    const response = await $fetch<ApiResponse<RegisterResponse>>(
      `${runtimeConfig.public.backendUrl}/api/auth/register`,
      {
        method: 'POST',
        body: { email, password },
      },
    );

    if (response.success) {
      const { user, accessToken, refreshToken } = response.data!;

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

      return { user };
    }

    throw createError({
      statusCode: 400,
      statusMessage: response.error.message,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || '註冊失敗',
      });
    }
  }
});

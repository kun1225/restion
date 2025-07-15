import type { User } from '~~/types/user';

type RegisterResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or password',
    });
  }

  const runtimeConfig = useRuntimeConfig();

  try {
    const response = await $fetch<RegisterResponse>(
      `${runtimeConfig.public.backendUrl}/api/auth/register`,
      {
        method: 'POST',
        body: { email, password },
      },
    );

    const { user, accessToken, refreshToken } = response.data;

    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user, accessToken };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Registration failed',
      });
    }
  }
});

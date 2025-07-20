export default defineEventHandler(async (event) => {
  const { email, password, rememberMe } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or password',
    });
  }

  const runtimeConfig = useRuntimeConfig();

  try {
    const response = await fetch(
      `${runtimeConfig.public.backendUrl}/api/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      },
    );

    const { user, accessToken, refreshToken } = await response.json();

    if (accessToken) {
      setCookie(event, 'access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }

    if (refreshToken) {
      setCookie(event, 'refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed',
    });
  }
});

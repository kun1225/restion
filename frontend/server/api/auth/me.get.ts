import type { User, ApiResponse } from '@restion/shared';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const accessToken = event.context.accessToken; // This will be set by a middleware

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const response = await $fetch<ApiResponse<User>>(
      `${runtimeConfig.public.backendUrl}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.success) {
      return { user: response.data };
    }

    throw createError({
      statusCode: 401,
      statusMessage: response.error.message,
    });
  } catch (error: unknown) {
    // Here we should also handle token refresh logic if accessToken is expired
    // For now, we'll just throw an error
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Registration failed',
      });
    }
  }
});

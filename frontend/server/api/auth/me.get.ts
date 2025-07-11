import type { User } from '@/types/user';

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
    const response = await $fetch<{ data: { user: User } }>(`${runtimeConfig.public.backendUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { user: response.data.user };
  } catch (error: any) {
    // Here we should also handle token refresh logic if accessToken is expired
    // For now, we'll just throw an error
    throw createError({
      statusCode: error.response?.status || 401,
      statusMessage: error.response?._data?.error?.message || 'Unauthorized',
    });
  }
});

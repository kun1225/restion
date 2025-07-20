export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token');

  if (refreshToken) {
    const runtimeConfig = useRuntimeConfig();
    try {
      await $fetch(`${runtimeConfig.public.backendUrl}/api/auth/logout`, {
        method: 'POST',
        body: { refreshToken },
      });
    } catch (error) {
      // 如果後端出錯或 token 已過期，仍在前端繼續登出流程
      console.error('Error logging out from backend:', error);
    }
  }

  // 無論後端是否成功，都清除客戶端的 cookie
  deleteCookie(event, 'access_token');
  deleteCookie(event, 'refresh_token');

  return { message: 'Logged out' };
});

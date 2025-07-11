import { useAuthStore } from '~~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  if (process.client) {
    authStore.loadFromLocalStorage();
  }

  // We don't have access to cookies here on client-side,
  // so we rely on an API call that can read the httpOnly cookie.
  if (process.server) {
    await authStore.fetchUser();
  }
});

import { useAuthStore } from '~~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    authStore.loadFromLocalStorage();
  }

  // We don't have access to cookies here on client-side,
  // so we rely on an API call that can read the httpOnly cookie.
  if (import.meta.server) {
    await authStore.fetchUser();
  }
});

import { useAuthStore } from '~~/stores/auth';

export default defineEventHandler((event) => {
  // This middleware should only run on server-side API calls
  if (event.path.startsWith('/api')) {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      event.context.accessToken = authStore.accessToken;
    }
  }
});

import { defineStore } from 'pinia';

type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.username,
    userInitial: (state) => state.user?.username.charAt(0).toUpperCase() ?? '',
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      // TODO: Don't use any type
      const { user, accessToken } = await $fetch<any>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      this.user = user;
      this.accessToken = accessToken;
    },

    async register(data: { email: string; password: string }) {
      // TODO: Don't use any type
      const { user, accessToken } = await $fetch<any>('/api/auth/register', {
        method: 'POST',
        body: data,
      });
      this.user = user;
      this.accessToken = accessToken;
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' });
      this.user = null;
      this.accessToken = null;
    },

    async fetchUser() {
      if (this.user) return;
      try {
        const { user } = await $fetch<any>('/api/auth/me');
        this.user = user;
      } catch (error) {
        this.user = null;
        this.accessToken = null;
      }
    },
  },
});

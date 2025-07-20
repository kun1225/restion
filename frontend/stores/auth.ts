import { defineStore } from 'pinia';

import type {
  User,
  RegisterRequest,
  LoginRequest,
  ApiResponse,
} from '@restion/shared';

type AuthState = {
  user: User | null;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.username,
  },

  actions: {
    async login(credentials: LoginRequest, rememberMe?: boolean) {
      const response = await $fetch<ApiResponse<User>>('/api/auth/login', {
        method: 'POST',
        body: {
          ...credentials,
          rememberMe,
        },
      });

      if (response?.success) {
        this.user = response.data!;
      }

      return response;
    },

    async register(data: RegisterRequest) {
      const response = await $fetch<ApiResponse<User>>('/api/auth/register', {
        method: 'POST',
        body: data,
      });

      if (response?.success) {
        this.user = response.data!;
      }

      return response;
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' });
      this.user = null;
      localStorage.removeItem('restion_user');
      localStorage.removeItem('restion_accessToken');
    },

    async fetchUser() {
      // if (this.user) return;
      // try {
      //   const { user } = await $fetch<any>('/api/auth/me');
      //   this.user = user;
      // } catch (error) {
      //   this.user = null;
      //   this.accessToken = null;
      // }
    },

    loadFromLocalStorage() {
      const user = localStorage.getItem('restion_user');
      if (user) {
        this.user = JSON.parse(user);
      }
    },
  },
});

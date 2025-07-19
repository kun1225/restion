import { defineStore } from 'pinia';

import type {
  User,
  RegisterResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
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
      const { user } = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      this.user = user;

      if (rememberMe) {
        localStorage.setItem('restion_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('restion_user');
      }
    },

    async register(data: RegisterRequest) {
      const { user } = await $fetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: data,
      });
      this.user = user;
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

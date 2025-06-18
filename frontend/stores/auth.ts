import { defineStore } from 'pinia';

type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
  }),
  getters: {
    userName: (state) => state.user?.name,
    userInitial: (state) => state.user?.name.charAt(0).toUpperCase() ?? '',
  },
  actions: {
    login() {
      this.isLoggedIn = true;
      this.user = {
        name: 'Kun',
        email: 'kun@example.com',
        avatarUrl: 'https://github.com/shadcn.png',
      };
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
    },
    toggleLogin() {
      if (this.isLoggedIn) {
        this.logout();
      } else {
        this.login();
      }
    },
  },
});

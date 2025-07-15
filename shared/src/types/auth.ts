import type { User } from './user';

export type RegisterResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

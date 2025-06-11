import { User } from '../types';
import { db } from '../utils/db';

export async function findByEmail(email: string): Promise<User | undefined> {
  return db<User>('users').where({ email }).first();
}

export async function createUser(user: Partial<User>): Promise<User> {
  const [created] = await db<User>('users').insert(user).returning('*');
  return created;
}

import type { User } from '@restion/shared';
import { db } from '../utils/db';

export async function findByEmail(email: string): Promise<User | undefined> {
  const result = await db<User>('users').where({ email }).first();
  return result;
}

export async function findById(id: number): Promise<User | undefined> {
  const result = await db<User>('users').where({ id }).first();
  return result;
}

export async function createUser(user: Partial<User>): Promise<User> {
  const [created] = await db<User>('users').insert(user).returning('*');
  return created;
}

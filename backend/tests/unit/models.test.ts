import { findByEmail, findById, createUser } from '../../src/models/User';
import { TestDbHelper } from '../helpers/testDb';

describe('User Model', () => {
  beforeEach(async () => {
    await TestDbHelper.cleanupAll();
  });

  afterEach(async () => {
    await TestDbHelper.cleanupAll();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password',
      };

      const user = await createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.password_hash).toBe(userData.password_hash);
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('updated_at');
    });

    it('should set default values for rest_ratio and reminder_interval', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password',
      };

      const user = await createUser(userData);

      expect(user.rest_ratio).toBe(5);
      expect(user.reminder_interval).toBe(25);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const testUser = await TestDbHelper.createTestUser({
        email: 'findme@example.com',
      });

      const foundUser = await findByEmail('findme@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe('findme@example.com');
    });

    it('should return undefined for non-existent email', async () => {
      const foundUser = await findByEmail('nonexistent@example.com');
      expect(foundUser).toBeUndefined();
    });

    it('should be case sensitive', async () => {
      await TestDbHelper.createTestUser({
        email: 'CaseSensitive@example.com',
      });

      const foundUser = await findByEmail('casesensitive@example.com');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const testUser = await TestDbHelper.createTestUser();

      const foundUser = await findById(testUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return undefined for non-existent id', async () => {
      const foundUser = await findById(99999);
      expect(foundUser).toBeUndefined();
    });

    it('should return undefined for invalid id', async () => {
      const foundUser = await findById(-1);
      expect(foundUser).toBeUndefined();
    });
  });
});

import { hashPassword, comparePassword } from '../../src/utils/hash';

describe('Hash Utils', () => {
  describe('hashPassword', () => {
    test('should hash password successfully', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'samepassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty password', async () => {
      const emptyPassword = '';
      const hashedPassword = await hashPassword(emptyPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('comparePassword', () => {
    test('should verify correct password', async () => {
      const password = 'correctpassword';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'correctpassword';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    test('should handle empty password verification', async () => {
      const password = 'nonemptypassword';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword('', hashedPassword);
      expect(isValid).toBe(false);
    });

    test('should handle invalid hash format', async () => {
      const password = 'testpassword';
      const invalidHash = 'invalidhashformat';

      const isValid = await comparePassword(password, invalidHash);
      expect(isValid).toBe(false);
    });
  });
});

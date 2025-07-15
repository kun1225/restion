import sharedConfig from '../shared/eslint.config.js';

export default [
  // Apply shared config first
  ...sharedConfig,
  // Then add Node.js/Backend specific rules
  {
    files: ['**/*.ts'],
    rules: {
      // Node.js specific rules
      'no-console': 'off', // Allow console in backend
      
      // Backend-specific preferences (stricter)
      '@typescript-eslint/no-explicit-any': 'error',
      
      // Security-related rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // Performance rules
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error',
      
      // Database/async patterns
      'require-await': 'error',
      'no-return-await': 'error',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      // Node.js specific rules for JS files
      'no-console': 'off', // Allow console in backend
    },
  },
  // Test file specific rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Relax for tests
      'no-magic-numbers': 'off', // Allow magic numbers in tests
      'max-len': 'off', // Allow long lines in tests
    },
  },
];

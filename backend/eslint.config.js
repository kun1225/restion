import sharedConfig from '../shared/eslint.config.js';

export default [
  // Apply shared config first
  ...sharedConfig,
  // Then add Node.js/Backend specific rules
  {
    files: ['**/*.ts', '**/*.js'],
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
];

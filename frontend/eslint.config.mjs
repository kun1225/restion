import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.ts', '**/*.js', '**/*.vue'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    semi: ['error', 'always'],
    'prefer-const': 'error',
    'no-var': 'error',

    // Vue-specific rules
    'vue/no-mutating-props': 'error',

    // Import organization
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
});

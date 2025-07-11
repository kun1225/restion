import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.ts', '**/*.js', '**/*.vue'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    eqeqeq: 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'vue/no-mutating-props': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
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

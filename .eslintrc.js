module.exports = {
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'import/exports-last': 'error',
    'import/default': 'error',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['*.js'],
      env: {
        browser: true,
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}

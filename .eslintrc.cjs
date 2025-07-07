module.exports = {
  root: true,
  env: {browser: true, node: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'expo-env.d.ts', 'android', 'supabase'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {order: 'asc', caseInsensitive: true},
        pathGroups: [
          '@screens/**',
          '@widgets/**',
          '@features/**',
          '@entities/**',
          '@shared/**',
        ].map((pattern) => ({
          pattern,
          group: 'internal',
          position: 'after',
        })),
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // pages
          {
            target: 'src/screens',
            from: ['src/application'],
          },
          {
            target: 'src/screens/*/**/*',
            from: 'src/screens/*/index.ts',
          },

          // widgets
          {
            target: 'src/widgets',
            from: ['src/application', 'src/screens'],
          },
          {
            target: 'src/widgets/*/**/*',
            from: 'src/widgets/*/index.ts',
          },

          // features
          {
            target: 'src/features',
            from: ['src/application', 'src/screens', 'src/widgets'],
          },
          {
            target: 'src/features/*/**/*',
            from: 'src/features/*/index.ts',
          },

          // entities
          {
            target: 'src/entities',
            from: ['src/application', 'src/screens', 'src/widgets', 'src/features'],
          },
          {
            target: 'src/entities/*/**/*',
            from: 'src/entities/*/index.ts',
          },

          // shared
          {
            target: 'src/shared',
            from: ['src/application', 'src/screens', 'src/widgets', 'src/features', 'src/entities'],
          },
        ],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Use public API only
          '@app/*/*/**',
          '@screens/*/**',
          '@widgets/*/**',
          '@features/*/**',
          '@entities/*/**',
          '@shared/*/*/**',

          '../**/application',
          '../**/screens',
          '../**/widgets',
          '../**/features',
          '../**/entities',
          '../**/shared',
        ],
      },
    ],
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
}

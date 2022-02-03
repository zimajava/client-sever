module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    createDefaultProgram: true,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 12,
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.ts', '.json'] } },
    'import/extensions': ['.js', '.ts', '.json'],
    jest: { version: 'detect' },
  },
  rules: {
    // prettier
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        bracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 100,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
        endOfLine: 'lf',
      },
    ],

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    'import/prefer-default-export': 'off',
  }
}

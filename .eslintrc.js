module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: [
    'react-hooks',
  ],
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    "react": {
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
    },
    "import/resolver": {
      "webpack": {
        "config": "./webpack.config.js"
      }
    }
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};

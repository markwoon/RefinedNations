// Config values:
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
//

module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    greasemonkey: true,
  },

  extends: [
    'eslint:recommended',
  ],

  globals: {
    GM_notification: 'readonly',
  },

  parserOptions: {
    ecmaVersion: 11,
    ecmaFeatures: {
      globalReturn: true,
    },
  },

  rules: {
  },
};

// eslint.config.js
import { Linter } from "eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended";

const eslintRecommended = {
  rules: {
    "for-direction": "error",
    "getter-return": ["error", { allowImplicit: true }],
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": ["error", "always"],
    "no-constant-condition": "warn",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-dupe-args": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-empty-character-class": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-semi": "error",
    "no-func-assign": "error",
    "no-import-assign": "error",
    "no-inner-declarations": ["error", "functions"],
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-obj-calls": "error",
    "no-promise-executor-return": "error",
    "no-prototype-builtins": "error",
    "no-regex-spaces": "error",
    "no-setter-return": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "no-unreachable-loop": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-optional-chaining": "error",
    "no-useless-backreference": "error",
    "require-atomic-updates": "error",
    "use-isnan": "error",
    "valid-typeof": ["error", { requireStringLiterals: true }],
  },
};

const typescriptEslintRecommended = {
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/triple-slash-reference": "error",
  },
};

export default [
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true,
      },
    },
    ...eslintRecommended,
    ...typescriptEslintRecommended,
    ...reactRecommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Add your custom rules here
    },
  },
];
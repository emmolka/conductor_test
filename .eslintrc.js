module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["prettier"],
  rules: {
    semi: [2, "always"],
    "object-curly-spacing": [2, "always"],
    "prettier/prettier": "error",
    "@typescript-eslint/no-var-requires": 0,
    "react/react-in-jsx-scope": "off",
    indent: ["error", 2, { SwitchCase: 1 }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

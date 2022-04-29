module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};

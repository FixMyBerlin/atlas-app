module.exports = require("@blitzjs/next/eslint")

// This is what we had in atlas v1:
//
// {
//   // https://www.npmjs.com/package/eslint-plugin-react
//   // https://www.npmjs.com/package/eslint-plugin-react-hooks
//   // https://www.npmjs.com/package/eslint-plugin-jsx-a11y
//   // https://github.com/prettier/eslint-config-prettier
//   // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md#when-not-to-use-it
//   "plugins": ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
//   "extends": [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react/recommended",
//     "plugin:jsx-a11y/recommended",
//     "plugin:react/jsx-runtime",
//     "prettier",
//     "plugin:prettier/recommended"
//   ],
//   // Docs: off=0, warn=1, error=2, see https://eslint.org/docs/user-guide/configuring/rules
//   "rules": {
//     "react/prop-types": "off",
//     // https://eslint.org/docs/latest/rules/no-unused-vars#options
//     // https://stackoverflow.com/a/61555310/729221
//     "no-unused-vars": "off",
//     "@typescript-eslint/no-unused-vars": [
//       "error",
//       {
//         "varsIgnorePattern": "^_",
//         "argsIgnorePattern": "^_",
//         "destructuredArrayIgnorePattern": "^_"
//       }
//     ],
//     // https://typescript-eslint.io/rules/ban-ts-comment/#allow-with-description
//     "@typescript-eslint/ban-ts-comment": [
//       "error",
//       {
//         "ts-ignore": "allow-with-description",
//         "ts-expect-error": "allow-with-description"
//       }
//     ],
//     "@typescript-eslint/no-explicit-any": "off"
//   },
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "ecmaVersion": "latest",
//     "sourceType": "module",
//     "ecmaFeatures": {
//       "jsx": true
//     }
//   },
//   "settings": {
//     "import/resolver": {
//       "typescript": {
//         "project": "."
//       }
//     },
//     "react": {
//       "version": "detect"
//     }
//   },
//   "root": true
// }

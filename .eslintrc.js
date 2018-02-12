module.exports = {
    "extends": "airbnb-base",
    "parser": "babel-eslint",
    "rules": {
      "padded-blocks": ["error", {
        "classes": "always",
        "switches": "never",
        "blocks": "never",
       }],
      "object-curly-newline": ["error", { "multiline": true }],
      "no-restricted-syntax": 0,
      "import/no-extraneous-dependencies": [
        "error",
        {
          "devDependencies": true,
          "optionalDependencies": false,
          "peerDependencies": false,
        }
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
    env: {
      "browser": true,
    }
};

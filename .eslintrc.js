module.exports = {
    "extends": "airbnb-base",
    "rules": {
      "padded-blocks": ["error", {
        "classes": "always",
        "switches": "never",
        "blocks": "never",
       }],
      "object-curly-newline": ["error", { "multiline": true }],
      "import/no-extraneous-dependencies": [
        "error",
        {
          "devDependencies": true,
          "optionalDependencies": false,
          "peerDependencies": false,
        }
      ],
    },
};

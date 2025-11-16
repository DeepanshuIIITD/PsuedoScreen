module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          "moduleName": "@env",
          "path": ".env",
          "safe": false,
          "allowUndefined": true
        }
      ],
      // Map "@/..." imports to project root for Metro at runtime
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "@": "./"
        }
      }],
      "expo-router/babel",
        // react-native-reanimated plugin MUST be last
      "react-native-reanimated/plugin"
    ]
  };
};

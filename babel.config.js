module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // any plugins go here, e.g.:
      // 'react-native-reanimated/plugin', // must be listed last if present
    ],
  };
};
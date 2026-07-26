const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');

// Some packages (e.g. zustand) ship a modern "exports" map that points to
// ESM-only files using import.meta, which Metro's web bundler can't parse.
// Disabling package-exports resolution makes Metro fall back to the plain
// CommonJS "main" field instead, avoiding those ESM-only code paths entirely.
// This only affects which file gets resolved — it doesn't change behavior
// on native (iOS/Android), which was already working.
config.resolver.unstable_enablePackageExports = false;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
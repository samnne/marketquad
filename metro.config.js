const { withNativewind } = require("nativewind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Add .wasm to the source extensions
config.resolver.sourceExts.push('wasm');
config.resolver.assetExts.push('wasm');
config.resolver.sourceExts.push('mjs', 'cjs');
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json');
// module.exports = config
module.exports = withNativewind(config);
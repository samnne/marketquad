const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add .wasm to the source extensions
config.resolver.sourceExts.push('wasm');

// module.exports = config
module.exports = withNativewind(config);

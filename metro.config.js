const { withNativewind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push("wasm");
config.resolver.assetExts.push("wasm");
config.resolver.sourceExts.push("mjs", "cjs");
config.resolver.sourceExts.push("ts", "tsx", "js", "jsx", "json");

// const defaultResolveRequest = config.resolver.resolveRequest;
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (moduleName === 'tslib' || moduleName === 'tslib/modules/index.js') {
//     return {
//       type: 'sourceFile',
//       filePath: require.resolve('tslib/tslib.js'),
//     };
//   }
//   return defaultResolveRequest
//     ? defaultResolveRequest(context, moduleName, platform)
//     : context.resolveRequest(context, moduleName, platform);
// };

module.exports = withNativewind(config);

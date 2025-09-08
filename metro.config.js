const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure platform-specific extensions
config.resolver.sourceExts.push('web.js', 'web.ts', 'web.tsx');

// Configure resolver to handle native modules on web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add platform-specific module resolution
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Configure module map for web platform
config.resolver.alias = {
  ...config.resolver.alias,
  // Mock react-native-maps for web
  'react-native-maps': require.resolve('./web-mocks/react-native-maps.js'),
};

module.exports = config;

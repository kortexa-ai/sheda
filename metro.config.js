const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
    const defaultConfig = getDefaultConfig(__dirname);

    const config = {
        resolver: {
            sourceExts: [...defaultConfig.resolver.sourceExts, "glsl"],
        },
        transformer: {
            babelTransformerPath: require.resolve("./babel/glsl-transformer.js"),
        },
    };

    return mergeConfig(defaultConfig, config);
})();
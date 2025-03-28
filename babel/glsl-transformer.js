const babelTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = function ({ src, filename, options }) {
    if (filename.endsWith("glsl")) {
        src = `module.exports = \`${src}\``;
    }
    return babelTransformer.transform({ src, filename, options });
};
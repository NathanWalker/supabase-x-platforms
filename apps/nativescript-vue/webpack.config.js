const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = env => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack(config => {
    config.resolve.alias.set(
      '@supabase-x-platforms/nativescript-data',
      resolve(__dirname, '../../packages/nativescript-data/src/index.ts')
    );
    config.resolve.alias.set(
      '@supabase-x-platforms/nativescript-ui',
      resolve(__dirname, '../../packages/nativescript-ui/src/index.ts')
    );
  });

  webpack.Utils.addCopyRule({
    from: '../../../tools/assets',
    to: 'assets',
    context: webpack.Utils.project.getProjectFilePath('node_modules'),
  });

  return webpack.resolveConfig();
};

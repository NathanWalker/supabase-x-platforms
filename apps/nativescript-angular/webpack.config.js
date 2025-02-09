const webpack = require('@nativescript/webpack');

module.exports = env => {
  webpack.init(env);
  webpack.useConfig('angular');

  webpack.Utils.addCopyRule({
    from: '../../../tools/assets',
    to: 'assets',
    context: webpack.Utils.project.getProjectFilePath('node_modules'),
  });

  return webpack.resolveConfig();
};

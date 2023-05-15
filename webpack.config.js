// Version if the local Node.js version supports async/await
// webpack.config.js

const webpack = require('webpack');
const slsw = require('serverless-webpack');
const path = require('path');

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    mode: 'production',
    entry: './index.js',
    output: {
      libraryTarget: 'commonjs',
      path: path.resolve(__dirname, '.webpack'),
      filename: 'index.js',
    },
    target: 'node',
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
  };
})();

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const PostCSSImport = require('postcss-import');
const PostCSSNext = require('postcss-cssnext');
const PreCSS = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getConfig = require('./server/config');

const outputPath = 'assets';

module.exports = () => {
  const config = getConfig(process.env.NODE_ENV);
  const minified = config.minified;
  const devServer = config.devServer;
  const host = config.host;
  const port = config.port;
  const devtool = config.devTool;

  const addPlugin = (add, plugin) => (add ? plugin : undefined);
  const ifDevServer = plugin => addPlugin(devServer, plugin);
  const ifMinified = plugin => addPlugin(minified, plugin);
  const ifNonMinified = plugin => addPlugin(!minified, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  const browserList = [
    'ie >= 10',
    'edge >= 13',
    'chrome >= 55',
    'firefox >= 50',
    'safari >= 9',
  ];

  const suffix = minified ? '.min' : '';
  const appFilename = `app${suffix}`;
  const vendorFilename = `vendor${suffix}`;
  const entries = {
    [appFilename]: [
      path.resolve(__dirname, 'src', 'app.jsx'),
    ],
    [vendorFilename]: removeEmpty([
      ifDevServer('react-hot-loader/patch'),
      ifDevServer(`webpack-dev-server/client?http://${host}:${port}`),
      ifDevServer('webpack/hot/only-dev-server'),
      'babel-polyfill',
      'react',
      'react-dom',
    ]),
  };

  return {
    entry: entries,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${outputPath}/[name]${!devServer ? '.[chunkhash:10]' : ''}.js`,
      publicPath: '/',
    },
    devtool,
    stats: {
      children: false,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules', 'src'],
    },
    module: {
      rules: removeEmpty([
        ifNonMinified({
          test: /\.(js|jsx)$/,
          use: ['eslint-loader'],
          exclude: /node_modules/,
          enforce: 'pre',
        }),
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    PostCSSImport,
                    PostCSSNext({
                      browsers: browserList,
                      compress: !!minified,
                    }),
                    PreCSS,
                  ],
                },
              },
            ],
          })),
        },
        { test: /\.(gif|png|jpg)$/, loader: 'file-loader?name=images/[name].[ext]' },
        { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' },
      ]),
    },
    plugins: removeEmpty([
      ifDevServer(new webpack.HotModuleReplacementPlugin()),
      ifDevServer(new webpack.NamedModulesPlugin()),
      ifDevServer(new webpack.NoEmitOnErrorsPlugin()),
      ifMinified(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      })),
      new ExtractTextPlugin({
        filename: `${outputPath}/[name]${!devServer ? '.[chunkhash:10]' : ''}.css`,
        allChunks: true,
      }),
      ifMinified(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      })),
      ifMinified(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
      })),
      new HtmlWebpackPlugin({
        title: 'My coolest repair shop',
        filename: 'index.html',
        cache: false,
        template: 'src/index.ejs',
        appMountId: 'app',
        inject: false,
        chunks: [
          vendorFilename,
          appFilename,
        ],
        chunksSortMode: 'manual',
      }),
    ]),
    devServer: ifDevServer({
      host,
      port,
      hot: true,
      historyApiFallback: true,
    }),
  };
};

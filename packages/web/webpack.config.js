/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const envs = dotenv.config();
dotenvExpand.expand(envs);

function getAppSrc() {
  return path.resolve(process.cwd(), 'src');
}
function resolve(filePath, fileName) {
  return path.resolve(getAppSrc(), 'pages', filePath, fileName);
}

const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevMode ? 'development' : 'production',
  entry: {
    login: resolve('Login', 'index.ts'),
    registration: resolve('Registration', 'index.ts'),
    main: resolve('Main', 'index.ts'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name]-[hash:8].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.json', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: path.resolve(process.cwd(), 'src'),
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/env', '@babel/preset-typescript'],
          plugins: [
            /* "@babel/plugin-proposal-class-properties" */
          ],
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: { implementation: require.resolve('sass') },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new CopyPlugin({ patterns: [{ from: 'public/img', to: 'img' }] }),
    !isDevMode && new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: resolve('Login', 'login.html'),
      excludeChunks: ['registration', 'main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'registration.html',
      template: resolve('Registration', 'registration.html'),
      excludeChunks: ['login', 'main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: resolve('Main', 'main.html'),
      excludeChunks: ['registration', 'login'],
    }),
  ].filter(Boolean),
  devtool: 'source-map',
  devServer: {
    hot: true,
    open: ['/login.html'],
    compress: true,
    host: 'localhost',
    port: 3003,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    static: {
      directory: path.join(process.cwd(), 'dist'),
      publicPath: '',
      watch: {
        ignored: getAppSrc(),
      },
    },
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      publicPath: '',
    },
  },
};

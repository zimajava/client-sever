/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
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

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const imageInlineSizeLimit = 8192;
const isDevMode = process.env.NODE_ENV !== 'production';
const shouldUseSourceMap = true;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDevMode && require.resolve('style-loader'),
    !isDevMode && { loader: MiniCssExtractPlugin.loader },
    {
      loader: 'css-modules-typescript-loader',
      options: { namedExport: true },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            'postcss-flexbugs-fixes',
            ['postcss-preset-env', { autoprefixer: { flexbox: 'no-2009' }, stage: 3 }],
            'postcss-normalize',
          ],
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: { sourceMap: shouldUseSourceMap, root: getAppSrc() },
      },
      {
        loader: require.resolve(preProcessor),
        options: { sourceMap: shouldUseSourceMap },
      },
    );
  }

  return loaders;
};

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
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: { dataUrlCondition: { maxSize: imageInlineSizeLimit } },
            generator: {
              filename: 'media/img/[name].[hash].[ext]',
            },
          },
          {
            test: /\.svg$/,
            type: 'asset',
            parser: { dataUrlCondition: { maxSize: imageInlineSizeLimit } },
            generator: {
              filename: 'media/svg/[name].[hash].[ext]',
            },
          },
          // {
          //   test: /\.svg$/,
          //   use: [
          //     {
          //       loader: require.resolve('@svgr/webpack'),
          //       options: {
          //         prettier: false,
          //         svgo: false,
          //         svgoConfig: { plugins: [{ removeViewBox: false }] },
          //         titleProp: true,
          //         ref: true,
          //       },
          //     },
          //     {
          //       loader: require.resolve('file-loader'),
          //       options: { name: 'media/svg/[name].[hash].[ext]' },
          //     },
          //   ],
          //   issuer: { and: [/\.(ts|tsx|js|jsx|md|mdx)$/] },
          // },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: path.resolve(process.cwd(), 'src'),
            loader: require.resolve('babel-loader'),
            options: {
              presets: ['@babel/env', '@babel/preset-typescript'],
              // plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: { mode: 'icss' },
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: { mode: 'local', localIdentName: '[name]__[local]___[hash:base64:5]' },
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: { mode: 'icss' },
              },
              'sass-loader',
            ),
            sideEffects: true,
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: { mode: 'local', localIdentName: '[name]__[local]___[hash:base64:5]' },
              },
              'sass-loader',
            ),
          },
          {
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: 'asset/resource',
            generator: {
              filename: 'media/[hash][ext][query]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    // new CopyPlugin({ patterns: [{ from: 'public/img', to: 'img' }] }),
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
      writeToDisk: true,
    },
  },
};

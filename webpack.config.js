const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = () => {
  dotenv.config();

  return {
    entry: {
      index: './src/js/index.js',
      chart: './src/js/chart.js',
      album: './src/js/album.js',
    },
    output: {
      filename: '[name]_bundle.js',
      path: path.resolve(__dirname, 'build'),
    },

    plugins: [
      new htmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        chunks: ['index'],
      }),

      new htmlWebpackPlugin({
        filename: 'chart.html',
        template: './page/chart.html',
        chunks: ['chart'],
      }),

      new htmlWebpackPlugin({
        filename: 'album.html',
        template: './page/album.html',
        chunks: ['album'],
      }),

      new miniCSSExtractPlugin({
        filename: '[name].common.css',
      }),

      new webpack.DefinePlugin({
        'process.env.YOUTUBE_API_KEY': JSON.stringify(
          process.env.YOUTUBE_API_KEY,
        ),
        'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(
          process.env.SPOTIFY_CLIENT_ID,
        ),
        'process.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(
          process.env.SPOTIFY_CLIENT_SECRET,
        ),
        'process.env.FIREBASE_API_KEY': JSON.stringify(
          process.env.FIREBASE_API_KEY,
        ),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
          process.env.FIREBASE_AUTH_DOMAIN,
        ),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
          process.env.FIREBASE_PROJECT_ID,
        ),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(
          process.env.FIREBASE_STORAGE_BUCKET,
        ),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
          process.env.FIREBASE_MESSAGING_SENDER_ID,
        ),
        'process.env.FIREBASE_APP_ID': JSON.stringify(
          process.env.FIREBASE_APP_ID,
        ),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(
          process.env.FIREBASE_MEASUREMENT_ID,
        ),
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [miniCSSExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|ico|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[hash]-[name].[ext]',
          },
        },
        {
          test: /\.mp4$/,
          use: 'file-loader?name=videos/[name].[ext]',
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
      ],
    },

    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      port: 8080,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
      },
    },
  };
};

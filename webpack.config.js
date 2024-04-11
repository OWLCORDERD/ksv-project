const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = () => {
  dotenv.config();

  return {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'build'),
    },

    plugins: [
      new htmlWebpackPlugin({
        template: './index.html',
      }),

      new miniCSSExtractPlugin({
        filename: 'common.css',
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
      ],
    },

    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      port: 8080,
    },
  };
};

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = () => {
  dotenv.config();

  return {
    /* 번들링 js 파일 설정 */
    entry: {
      index: './src/js/index.js',
      chart: './src/js/chart.js',
      album: './src/js/album.js',
    },

    /* 번들링 js 파일 저장 경로 설정 */
    output: {
      filename: '[name]_bundle.js',
      path: path.resolve(__dirname, 'build'),
    },

    /* webpack은 js 파일만 인식하여 번들링하기에 html, css 파일 번들링 설정을
    설정해주는 htmlWebpackPlugin, miniCSSExtractPlugin 사용 */
    plugins: [
      new htmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        excludeChunks: ['chart', 'album'],
      }),

      new htmlWebpackPlugin({
        filename: 'chart.html',
        template: './chart.html',
        chunks: ['chart'],
      }),

      new htmlWebpackPlugin({
        filename: 'album.html',
        template: './album.html',
        chunks: ['album'],
      }),

      new miniCSSExtractPlugin({
        filename: '[name].common.css',
      }),

      /* docenv 환경변수 설정 (entry script 번들링 파일들을 webpack build time에 전역 환경 변수를
        선언하여 webpack이 스크립트상에 존재하는 모든 변수 문자열을 대체 가능) */
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

    /* css loader, 이미지 url loader 모듈 */
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

    /* 개발 모드 서버 */
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      port: 8080,
    },

    /* 절대 경로 설정 */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
      },
    },
  };
};

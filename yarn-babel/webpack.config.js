'use strict';

const path = require('path');

module.exports = ({production = false, ssr = false, lite = false} = {}) => {
//  process.env.NODE_ENV = production ? 'production' : 'development';
  const webpackConfig = {
    entry: {
      main: ['./src/main.js'],
      vendor: (lite ? [] : ['./src/stdlib.js']).concat(['react', 'react-dom'])
    },
    module: {
      loaders: [{
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, './src'),
        loaders: 'babel-loader'
      }]
    },
    plugins: [],
    devServer: {
      contentBase: './yarn-babel',
      inline: true,
      host: 'localhost',
      port: 8000
    }
  };
};
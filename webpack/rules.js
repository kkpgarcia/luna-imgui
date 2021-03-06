const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const path = require('path');


module.exports = ({
  isProduction = false,
  isServer = false
}) => {
  const typescript = {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: 'awesome-typescript-loader',
    },],
  };
  const scss = {
    test: /\.s?css$/,
    exclude: /node_modules/,
    use: [
      ...(!isProduction ? ['css-hot-loader'] : []),
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: false,
          // localIdentName: isProduction ? '[name]__[local]--[hash:base64:5]' : '[name]__[local]',
          sourceMap: !isProduction,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: paths.configs
          }
        }
      },
      /**
       * Loader: @epegzz/sass-vars-loader
       * Use case: when you use scss or css inside javascript or typescript.
       * 
       */

      // {
      //   loader: '@epegzz/sass-vars-loader',
      //   options: {
      //     syntax: 'scss',
      //     files: [
      //       path.resolve(__dirname, '../styles/resources/colors.js'),
      //       path.resolve(__dirname, '../styles/resources/media-breakpoints.js')
      //     ],
      //   },
      // },
    ],
  };
  const fonts = [{
    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        mimetype: 'application/font-woff',
        name: '[name].[ext]',

        publicPath: (url, resourcePath, context) => {
          if (isProduction) {
            return paths.public + url;
          }
          return `/${url}`
        },
      },
    }],
  },
  {
    test: /\.(ttf)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        mimetype: 'application/font-ttf',
        name: '[name].[ext]',

        publicPath: (url, resourcePath, context) => {
          if (isProduction) {
            return paths.public + url;
          }
          return `/${url}`
        },
      },
    }],
  }
  ]

  return [typescript, ...fonts];
}

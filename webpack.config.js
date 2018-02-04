const path = require('path');

const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/ant-theme-vars.less'), 'utf8'));

module.exports = {
  cache: true,
  devtool: 'eval',

  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: [
    'index.tsx'
  ],

  // configure the output directory and publicPath for the devServer
  output: {
    filename: 'app.js',
    publicPath: '/public/',
    path: path.resolve('dist')
  },

  // configure the dev server to run 
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: '/public/'
    },
    inline: true,
  },

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },
  externals: [
    function resolveMeteor(context, request, callback) {
      let match = request.match(/^meteor\/(.+)$/)
      let pack = match && match[1]
      let locator = pack && `Package["${pack}"]`
      return locator ? callback(null, locator) : callback()
    }
  ],
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: [ /node_modules/, /meteor-client.js/ ],
      use: [{
        loader: 'babel-loader',
        options: {
          "presets": ["react", "es2015"],
          "plugins": [
            ["import", {
              "libraryName": "antd",
              "style": true
            }]
          ]
        }
      },
      {
        loader: 'ts-loader'
      }
      ]
    }, {
      test: /\.js$/,
      exclude: [ /node_modules/, /meteor-client.js/ ],
      use: [{
        loader: 'babel-loader',
        options: {
          "presets": ["react", "es2015"],
          "plugins": [
            ["import", {
              "libraryName": "antd",
              "style": true
            }]
          ]
        }
      }]
    },
    {
      test: /\.css$/, // Only .css files
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          publicPath: '/public/'
        }
      },
      {
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true,
        },
      },
      ],
    },
    {
      test: /\.less$/,
      use: [{
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      },
      {
        loader: "less-loader",
        options: {
          modifyVars: themeVariables
        }
      }
      ]
    }
    ]
  },
}
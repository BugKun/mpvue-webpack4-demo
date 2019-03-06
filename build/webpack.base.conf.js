var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var vueLoaderConfig = require('./vue-loader.conf')
var MpvuePlugin = require('webpack4-mpvue-asset-plugin')
var glob = require('glob')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ThreadLoader = require('thread-loader')
var MpvueOptimizePlugin = require('webpack4-mpvue-optimize-plugin')

// 新增多线程打包
ThreadLoader.warmup({}, [
  'babel-loader'
])

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// 修正路径分隔符
function normalize(pathStr) {
  return pathStr.split(path.sep).join('/')
}

function getEntry (rootSrc) {
  var map = {};
  glob.sync(rootSrc + '/pages/**/main.js')
  .forEach(file => {
    var tmpFile = file;
    var key = tmpFile.replace(normalize(rootSrc) + '/', '').replace('.js', '');
      map[key] = tmpFile;
  })
   return map;
}

const appEntry = { app: normalize( resolve('./src/main.js') ) }
const pagesEntry = getEntry(resolve('./src'), 'pages/**/main.js')
const entry = Object.assign({}, appEntry, pagesEntry)

let baseWebpackConfig = {
  // 如果要自定义生成的 dist 目录里面的文件路径，
  // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
  // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
  entry,
  target: require('mpvue-webpack-target-webpack4'),
  output: {
    path: normalize(config.build.assetsRoot),
    jsonpFunction: 'webpackJsonpMpvue',
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? normalize(config.build.assetsPublicPath)
      : normalize(config.dev.assetsPublicPath)
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'mpvue',
      '@': resolve('src')
    },
    symlinks: false,
    aliasFields: ['mpvue', 'weapp', 'browser'],
    mainFields: ['browser', 'module', 'main']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // any required modules inside node_modules are extracted to vendor
        cacheGroups: {
          vendor: {
            name: 'common/vendor',
            test(module, chunks) {
              if(chunks.length > 1) return true
              const reg = /node_modules/
              if (module.nameForCondition && reg.test(module.nameForCondition())) {
                return true
              }
              for (const chunk of module.chunksIterable) {
                if (chunk.name && reg.test(chunk.name)) {
                  return true
                }
              }
              return false
            },
            chunks: 'initial',
            priority: 10,
            enforce: true
          }
        }
      }
    },
    runtimeChunk: {
      name: 'common/manifest'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'webpack4-mpvue-loader',
            options: vueLoaderConfig
          }
        ]
      },
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          {
            loader: 'webpack4-mpvue-loader',
            options: Object.assign({checkMPEntry: true}, vueLoaderConfig)
          },
          'thread-loader',
          'babel-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[ext]')
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [

          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('media/[name].[ext]')
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[ext]')
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // api 统一桥协议方案
    new webpack.DefinePlugin({
      'mpvue': 'global.mpvue',
      'mpvuePlatform': 'global.mpvuePlatform'
    }),
    new MpvuePlugin(),
    new CopyWebpackPlugin([{
      from: '**/*.json',
      to: ''
    }], {
      context: 'src/'
    }),
    new MpvueOptimizePlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(config.build.assetsRoot, './static'),
        ignore: ['.*']
      }
    ])
  ]
}

// 针对百度小程序，由于不支持通过 miniprogramRoot 进行自定义构建完的文件的根路径
// 所以需要将项目根路径下面的 project.swan.json 拷贝到构建目录
// 然后百度开发者工具将 dist/swan 作为项目根目录打
const projectConfigMap = {
  tt: '../project.config.json',
  swan: '../project.swan.json'
}

const PLATFORM = process.env.PLATFORM
if (/^(swan)|(tt)$/.test(PLATFORM)) {
  baseWebpackConfig = merge(baseWebpackConfig, {
    plugins: [
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, projectConfigMap[PLATFORM]),
        to: path.resolve(config.build.assetsRoot)
      }])
    ]
  })
}

module.exports = baseWebpackConfig

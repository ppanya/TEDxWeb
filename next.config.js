const path = require('path')
const webpack = require('webpack')

module.exports = {
  webpack: function (config, { dev }) {
    config.plugins = config.plugins.filter(
      (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    )

    config.module.rules.push(
      {
        test: /\.(css|scss)$/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      }, {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      }, {
        test: /\.scss$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules/normalize.css']
                .map((d) => path.join(__dirname, d))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )

    if (dev) {
      return config
    }


    config.resolve.alias = {
      'react': 'preact-compat/dist/preact-compat',
      'react-dom': 'preact-compat/dist/preact-compat',
      'styles': 'styles'
    }

    config.plugin.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    )

    return config
  }
}
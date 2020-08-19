const { ProvidePlugin } = require('webpack');

console.log(`Aquaria Backend: ${process.env.VUE_APP_AQUARIA_BACKEND}`);
console.log(`Export Backend: ${process.env.VUE_APP_AQUARIA_EXPORT_URL}`);
console.log(`Static SPA Mode Enabled: ${!!process.env.VUE_APP_STATIC_SPA_MODE}`);

module.exports = {
  configureWebpack: baseConfig => {
    const config = {
      module: {
        rules: [
          {
            test: /node_modules\/d3\//,  // fix old d3/jsdom compile errors by excluding jsdom
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: 'document = require("jsdom").jsdom("<html><head></head><body></body></html>")',
                  replace: ''
                },
                {
                  search: 'window = document.createWindow();',
                  replace: ''
                }
              ]
            }
          }
        ]
      },
      optimization: {
        moduleIds: 'hashed',
        splitChunks: {
          cacheGroups: {
            legacy: { // extract legacy aquaria code into separate bundle
              chunks: 'all',
              test: /src\/legacy/
            },
            vendor: { // extract dependencies into separate bundle
              chunks: 'all',
              test: /node_modules/
            },
          }
        }
      },
      plugins: [
        new ProvidePlugin({
          // provide jQuery globals to legacy scripts and jQuery plugins
          $: require.resolve('jquery'),
          jQuery: require.resolve('jquery'),
          'window.$': require.resolve('jquery'),
          'window.jQuery': require.resolve('jquery'),
          // provide jolecule global to legacy scripts
          // @TODO switch back to npm jolecule at some point
          jolecule: require.resolve('./src/legacy/javascripts/jolecule.js')
        })
      ],
      devServer: {
        historyApiFallback: {
          disableDotRule: false
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {

    }
    else {
      // bust cache during development (Vue's default ETag implementation doesn't work well with Safari in particular)
      config.output = {
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].js'
      }
    }

    return config;
  },
  chainWebpack: config => {
    // ignore 404.html unless static SPA mode configured
    if (!process.env.VUE_APP_STATIC_SPA_MODE) {
      config.plugin('copy').tap(args => {
        args[0][0].ignore.push('404.html');
        return args;
      });
    }
    return config;
  }

}

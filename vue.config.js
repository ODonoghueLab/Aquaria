module.exports = {
  configureWebpack: config => {

    const c = {
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
        splitChunks: {
          cacheGroups: {
            legacy: { // extract legacy aquaria code into separate bundle
              chunks: 'all',
              test: /src\/legacy/
            },
            jolecule: { // extract jolecule code into separate bundle
              chunks: 'all',
              test: /public\/javascripts\/jolecule.js/
            }
          }
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {

    }
    else {
      // bust cache during development (Vue's default ETag implementation doesn't work well with Safari in particular)
      c.output = {
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].js'
      }
    }

    return c;
  }
}

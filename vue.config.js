module.exports = {
  configureWebpack: config => {

    const module = {
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
    }

    if (process.env.NODE_ENV === 'production') {
      return {
        module
      }
    } else {
      // bust cache during development (Vue's default ETag implementation doesn't work well with Safari in particular)
      return {
        module,
        output: {
          filename: '[name].[hash].js',
          chunkFilename: '[id].[hash].js'
        }
      }
    }
  }
}

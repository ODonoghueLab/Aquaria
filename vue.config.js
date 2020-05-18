module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {}
    } else {
      // bust cache during development (Vue's default ETag implementation doesn't work well with Safari in particular)
      return {
        output: {
          filename: '[name].[hash].js'
        }
      }
    }
  }
}

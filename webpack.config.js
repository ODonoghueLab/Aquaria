const path = require('path');
const serverConfig = {
  entry: 'app.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  }
  //…
};

const clientConfig = {
  entry: './src/main.js',
  target: 'web', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
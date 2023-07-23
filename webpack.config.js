const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    setupMiddlewares: (devServer) => {
      // Add your custom middlewares here if needed
      // For example, to enable CORS for the dev server
      devServer.app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      });
    },
  },
  // Other webpack configuration options...
};
module.exports = {
  css: {
    sourceMap: true,
  },
  publicPath: '/',
  outputDir: '../public',
  lintOnSave: false,
  pages: {
    index: {
      entry: './src/main.ts',
      template: './public/index.html',
      filename: '../public/index.html',
    },
  }
};
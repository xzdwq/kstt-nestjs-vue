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
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          oneOf: [
            {
              resourceQuery: /^\?vue/,
              use: ['pug-plain-loader']
            },
            {
              use: ['raw-loader', 'pug-plain-loader']
            }
          ]
        }
      ]
    }
  }
};

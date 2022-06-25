const { defineConfig } = require('@vue/cli-service')
// const dotenv = require('dotenv-webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      // new dotenv({
      //   path: './.env',
      //   allowEmptyValues: false,
      //   silent: false,
      //   prefix: 'import.meta.env'
      // })
    ]
  },
  outputDir: './dist/',
  assetsDir: 'static'
})

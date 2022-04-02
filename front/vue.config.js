const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    // devtool: 'source-map',
    plugins: [
      new Dotenv()
    ]
  },

  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  },

  transpileDependencies: [
    'vuetify'
  ],

  outputDir: './dist/',
  assetsDir: 'static'
}

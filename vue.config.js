// var webpack = require('webpack');
module.exports = {
    // chainWebpack: config => {
    // remove the prefetch plugin
    // config.plugins.delete('html')
    // config.module.rule('eslint').use('eslint-loader').options({
    //   fix: true
    // });
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')
    // },
    pluginOptions: {
        i18n: {
            locale: "vi",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: false
        }
    },
    devServer: {
        https: true,
        port: 8000
    },
    productionSourceMap: false,
    publicPath: "./",
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
    },
};

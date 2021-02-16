module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    }
};
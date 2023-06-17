let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8181"
};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8181',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 3000,
        proxy: proxyObj
    }
}
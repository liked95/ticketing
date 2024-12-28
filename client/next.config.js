module.exports = {
    webpack: (config) => {
        config.watchOptions = {
            ignored: /node_modules/,
            aggregateTimeout: 300,
        };
        return config;
    },
};

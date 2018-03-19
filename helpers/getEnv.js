const Confidence = require('confidence');

const data = {
    port: {
        $filter: 'env',
        $default: 7878,
        staging: 7879,
        production: 7878
    },
    mongodb: {
        $filter: "env",
        $default: 'mongodb://localhost/slackato',
        staging: process.env.APP_DB_DEV || 'mongodb://localhost/slackato_dev',
        production: process.env.APP_DB || 'mongodb://localhost/slackato',
    },
};

const store = new Confidence.Store(data);
const criteria = {
    env: process.env.NODE_ENV || 'development'
};

module.exports = (key, defaultValue = null) => {
    return store.get(key, criteria) || defaultValue;
};
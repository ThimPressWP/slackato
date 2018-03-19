const Confidence = require('confidence');

const data = {
    port: {
        $filter: 'env',
        $default: 7878,
        staging: 7879,
        production: 7878
    },
    host: {
        $filter: 'env',
        $default: "http://localhost:7878",
        production: process.env.HOST || "https://slackato.marketify.co"
    },
    mongodb: {
        $filter: "env",
        $default: 'mongodb://localhost/slackato',
        staging: process.env.APP_DB_DEV || 'mongodb://localhost/slackato_dev',
        production: process.env.APP_DB || 'mongodb://localhost/slackato',
    },
    envato: {
        $filter: 'env',
        $default: {
            appID: process.env.ENVATO_APP_ID || "",
            appKey: process.env.ENVATO_APP_KEY || "",
        },
        production: {
            appID: process.env.ENVATO_APP_ID || "",
            appKey: process.env.ENVATO_APP_KEY || "",
        }
    },
    slack: {
        $filter: 'env',
        $default: {
            appID: process.env.ENVATO_APP_ID || "",
            appKey: process.env.ENVATO_APP_KEY || "",
        },
        production: {
            appID: process.env.SLACK_APP_ID || "",
            appKey: process.env.SLACK_APP_KEY || "",
        }
    }
};

const store = new Confidence.Store(data);
const criteria = {
    env: process.env.NODE_ENV || 'development'
};

module.exports = (key, defaultValue = null) => {
    return store.get(key, criteria) || defaultValue;
};
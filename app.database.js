const createConnection = require('./libs/createConnection');
const getEnv = require("./helpers/getEnv");
const uri = getEnv('/mongodb');

const app = createConnection(uri, {
    poolSize: 10
});

module.exports = app;
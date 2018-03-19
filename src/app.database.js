const createConnection = require('./libs/createConnection');
const getEnv = require("./helpers/getEnv");
const uri = getEnv('/mongodb');

module.exports = createConnection(uri);
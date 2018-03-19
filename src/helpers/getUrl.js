const getEnv = require('../helpers/getEnv');
const host = getEnv('/host');

module.exports = (sub) => {
    return host + sub;
};
const getEnv = require('../helpers/getEnv');
const host = getEnv('/host');

exports.url = (sub) => {
    return host + sub;
};
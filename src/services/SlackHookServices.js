const request = require('request-promise-native');

module.exports.send = function (url, data) {
    return request({
        method: 'POST',
        uri: url,
        body: data,
        json: true
    });
};
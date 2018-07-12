const request = require('request-promise-native');

module.exports.send = function (url, data) {
    data = JSON.stringify(data);

    return request({
        method: 'POST',
        uri: url,
        from: data,
    });
};
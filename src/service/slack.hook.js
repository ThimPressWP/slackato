'use strict';

const request = require('request');

module.exports.send = function (url, data) {
    let deferred = Promise.defer();
    data = JSON.stringify(data);

    request.post(url, {form: data}, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        return deferred.resolve(body);
    });

    return deferred.promise;
};
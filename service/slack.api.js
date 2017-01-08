'use strict';

const request = require('request');
const q = require('q');

module.exports.getToken = function (code) {
    let deferred = q.defer();

    let data = {
        client_id: process.env.APP_CLIENT_ID || '',
        client_secret: process.env.APP_CLIENT_SECRET || '',
        code: code,
        redirect_uri: process.env.HOST + '/oauth',
    };

    request.post('https://slack.com/api/oauth.access', {form: data}, (error, response, body) => {
        if (error) {
            deferred.reject(error);
        }

        try {
            let object = JSON.parse(body);
            let ok = object.ok || false;
            if (!ok) {
                deferred.reject(object);
            } else {
                deferred.resolve(object);
            }

        } catch (e) {
            deferred.reject('Parse json error!');
        }

    });

    return deferred.promise;
};
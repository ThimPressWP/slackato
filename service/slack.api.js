'use strict';

const request = require('request');

module.exports.getToken = function (code) {
    return new Promise((resolve, reject) => {
        let data = {
            client_id: process.env.APP_CLIENT_ID || '',
            client_secret: process.env.APP_CLIENT_SECRET || '',
            code: code,
            redirect_uri: process.env.APP_REDIRECT_URI || '',
        };

        request.post('https://slack.com/api/oauth.access', {form: data}, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                let object = JSON.parse(body);
                let ok = object.ok || false;
                if (!ok) {
                    reject(object);
                } else {
                    resolve(object);
                }

            } catch (e) {
                reject('Parse json error!');
            }

        });
    });
};
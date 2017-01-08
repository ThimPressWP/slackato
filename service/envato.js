'use strict';

const request = require('request');
const q = require('q');

let client_id = process.env.ENVATO_APP_ID;
let key = process.env.ENVATO_APP_KEY;
let redirect = process.env.HOST + '/envato';

module.exports.getUrlAuth = () => {
    return `https://api.envato.com/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect}`;
};

module.exports.getToken = (code) => {
    let deferred = q.defer();

    let url = 'https://api.envato.com/token';

    let data = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: key,
        code
    };

    request.post(url, {form: data}, (error, response, body) => {
        if (error) {
            deferred.reject(error);
        }

        try {
            let object = JSON.parse(body);

            if (object.error) {
                deferred.resolve(object.error_description);
            }

            delete object.token_type;
            delete object.expires_in;

            deferred.resolve(object);
        } catch (e) {
            deferred.reject('Parse json error!');
        }
    });

    return deferred.promise;
};
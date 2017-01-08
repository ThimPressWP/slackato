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

    console.log(data);

    request.post(url)
        .form(data)
        .then(
            (a, b, c) => {
                console.log(a);
                console.log(b);
                console.log(c);

                deferred.resolve(true);
            }
        )
        .catch(
            error => {
                console.log(error);
                deferred.reject(error);
            }
        );

    return deferred.promise;
};
'use strict';

const request = require('request');

let client_id = process.env.ENVATO_APP_ID;
let client_key = process.env.ENVATO_APP_KEY;
let redirect = process.env.HOST + '/envato';

function getAccessToken(refresh_token) {
    let deferred = Promise.defer();

    let data = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_key
    };

    request.post('https://api.envato.com/token', {form: data}, (error, response, body) => {
        if (error) {
            deferred.reject(error);
        }

        try {
            let object = JSON.parse(body);

            if (object.error) {
                deferred.reject(object.error_description);
            }

            deferred.resolve(object.access_token);
        } catch (e) {
            deferred.reject('Parse json error!');
        }
    });

    return deferred.promise;
}

function requestApi(args, access_token, refresh_token) {
    let deferred = Promise.defer();

    console.log('Request api', args.url, access_token);

    request({
        url: args.url,
        method: args.method || 'GET',
        form: args.data,
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }, (error, response, body) => {
        try {
            let object = JSON.parse(body);

            if (object.error == 'forbidden') {
                return getAccessToken(refresh_token)
                    .then(
                        token => {
                            return requestApi(args, token, refresh_token);
                        }
                    )
                    .catch(
                        error => {
                            deferred.reject(error);
                        }
                    );
            } else if (object.error) {
                deferred.reject(object.description);
            } else {
                deferred.resolve(object);
            }
        } catch (e) {
            deferred.reject('PARSE_JSON_FAILED');
        }
    });

    return deferred.promise;
}

module.exports.getUrlAuth = () => {
    return `https://api.envato.com/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect}`;
};

module.exports.getToken = (code) => {
    let deferred = Promise.defer();

    let url = 'https://api.envato.com/token';

    let data = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_key,
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

module.exports.getSaleByCode = (code, token) => {
    let deferred = Promise.defer();

    console.log(`Get sale by code: ${code} with token ${token}`);

    let access_token = token.access_token;
    let refresh_token = token.refresh_token;

    requestApi({
        url: `https://api.envato.com/v3/market/author/sale?code=${code}`
    }, access_token, refresh_token)
        .then(
            response => {
                deferred.resolve({
                    name: response.item.name,
                    url: response.item.url,
                    license: response.license,
                    supported_until: response.supported_until,
                    buyer: response.buyer,
                    purchase_code: code,
                    purchase_count: response.purchase_count
                });
            }
        )
        .catch(
            error => {
                deferred.reject(error);
            }
        );

    return deferred.promise;
};
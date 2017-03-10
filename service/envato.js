'use strict';

const request = require('request');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');

let client_id = process.env.ENVATO_APP_ID;
let client_key = process.env.ENVATO_APP_KEY;
let redirect = process.env.HOST + '/envato';

function _request(args, access_token) {
    let deferred = Promise.defer();

    request({
        url: args.url,
        method: args.method || 'GET',
        form: args.data,
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error.message);
        }

        try {
            let object = JSON.parse(body);

            return deferred.resolve(object);
        } catch (e) {
            deferred.reject('Parse json error!');
        }
    });

    return deferred.promise;
}

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
            return deferred.reject(error);
        }

        try {
            let object = JSON.parse(body);

            if (object.error) {
                return deferred.reject(object.error_description);
            }

            return deferred.resolve(object.access_token);
        } catch (e) {
            deferred.reject('Parse json error!');
        }
    });

    return deferred.promise;
}

function requestApi(args, access_token, refresh_token, teamID) {
    console.log('Request api', args.url, access_token, refresh_token);

    let deferred = Promise.defer();

    _request(args, access_token)
        .then(
            function (response) {
                if (response.item) {
                    return Promise.resolve(response);
                }

                if (response.error && response.error == 'forbidden') {
                    return getAccessToken(refresh_token)
                        .then(
                            new_access_token => {
                                console.log(`New access token ${new_access_token}`);

                                // Update new access token
                                Team.saveEnvatoTokenByTeamID(teamID, {refresh_token, access_token: new_access_token})
                                    .then(
                                        save => {
                                            console.log('Update new access token', save);
                                        }
                                    );

                                return _request(args, new_access_token);
                            }
                        );
                }

                let message = 'Something went wrong! Please install app try again!';
                if (response.description) {
                    message = message.description;
                }

                if (response.Message) {
                    message = response.Message;
                }

                return Promise.reject(message);
            }
        )
        .then(
            response => {
                if (response.error) {
                    return deferred.reject(response.description);
                }

                return deferred.resolve(response);
            }
        )
        .catch(
            message => {
                return deferred.reject(message);
            }
        );

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

module.exports.getSaleByCode = (code, team) => {
    let deferred = Promise.defer();
    let token = team.envato_token;
    let teamID = team.team_id;

    console.log(`Get sale by code: ${code} with token\n`, token);

    let access_token = token.access_token;
    let refresh_token = token.refresh_token;

    requestApi({
        url: `https://api.envato.com/v3/market/author/sale?code=${code}`
    }, access_token, refresh_token, teamID)
        .then(
            response => {
                console.info('Purchase code exist');

                return deferred.resolve({
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
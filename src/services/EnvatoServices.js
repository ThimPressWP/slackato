const request = require('request-promise-native');
const getEnv = require('../helpers/getEnv');
const getUrl = require('../helpers/getUrl');


const client_id = getEnv('/envato/appID');
const client_key = getEnv('/envato/appKey');
const redirect = getUrl('/envato');

const _request = (args, access_token) => {
    return request({
        uri: args.url,
        method: args.method || 'GET',
        form: args.data,
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        json: true
    });
};

const _getAccessToken = (refresh_token) => {
    const data = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_key
    };

    return request({
        uri: 'https://api.envato.com/token',
        method: 'POST',
        form: data,
        json: true
    }).then(result => {
        const {error, error_description, access_token} = result;

        if (error) {
            return Promise.reject(error_description);
        }

        return Promise.resolve(access_token);
    });
};

const _requestAPI = (args, access_token, refresh_token, teamID) => {
    console.log('Request api', args.url, access_token, refresh_token);

    return _getAccessToken(refresh_token)
        .then(access_token_ => {
            console.log(`New access token ${access_token_}`);

            return _request(args, access_token_);
        })
        .then(
            function (response) {
                if (response.item) {
                    return Promise.resolve(response);
                }

                let message = 'Something went wrong! Please install app try again!';
                if (response.description) {
                    message = response.description;
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
                    return Promise.reject(response.description);
                }

                return Promise.resolve(response);
            }
        )
        .catch(
            message => {
                return Promise.reject(message);
            }
        );
};

exports.getUrlAuth = () => {
    return `https://api.envato.com/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect}`;
};

exports.getToken = (code) => {
    const data = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_key,
        code
    };

    return request({
        uri: 'https://api.envato.com/token',
        method: 'POST',
        form: data,
        json: true
    }).then(object => {
        if (object.error) {
            return Promise.resolve(object.error_description);
        }

        delete object.token_type;
        delete object.expires_in;

        return Promise.resolve(object);
    });
};

exports.getSaleByCode = (code, team) => {
    const token = team.envatoToken;
    const {teamID} = team;

    console.log(`Get sale by code: ${code} with token\n`, token);

    const {access_token, refresh_token} = token;

    return _requestAPI({
        url: `https://api.envato.com/v3/market/author/sale?code=${code}`
    }, access_token, refresh_token, teamID)
        .then(response => {
            console.info('Purchase code exist');

            return Promise.resolve({
                name: response.item.name,
                url: response.item.url,
                license: response.license,
                supported_until: response.supported_until,
                buyer: response.buyer,
                purchase_code: code,
                purchase_count: response.purchase_count
            });
        });
};
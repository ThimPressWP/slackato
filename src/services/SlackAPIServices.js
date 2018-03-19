const request = require('request-promise-native');
const getEnv = require('../helpers/getEnv');

exports.getAccessToken = (code) => {
    const data = {
        client_id: getEnv('/slack/appID'),
        client_secret: getEnv('/slack/appKey'),
        code: code,
        redirect_uri: getEnv('/host') + '/oauth',
    };

    return request({
        uri: 'https://slack.com/api/oauth.access',
        method: 'POST',
        body: data,
        json: true
    }).then(result => {
        const {ok, error} = result;

        if (!ok) {
            throw new Error(error);
        }

        return Promise.resolve(result);
    });
};
const request = require('request-promise');
const getEnv = require('../helpers/getEnv');

module.exports.getToken = (code) => {
    const data = {
        client_id: getEnv('/slack/appID'),
        client_secret: getEnv('/slack/appKey'),
        code: code,
        redirect_uri: getEnv('/host') + '/oauth',
    };

    return request({
        uri: 'https://slack.com/api/oauth.access',
        method: 'POST',
        form: data,
    }).then(result => {
        try {
            const object = JSON.parse(result);
            const ok = object.ok || false;

            if (!ok) {
                return Promise.reject(object);
            }

            return Promise.resolve(object);
        } catch (e) {
            console.error(e);

            throw new Error('Parse json error!');
        }
    });
};
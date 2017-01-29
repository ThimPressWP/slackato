'use strict';

const timeHelper = global.helpers.time;

module.exports.verifySuccess = (item) => {
    return {
        response_type: 'in_channel',
        "attachments": [
            {
                "color": "#36a64f",
                "title": item.name,
                "title_link": item.url,
                "fields": [
                    {
                        "title": "Buyer",
                        "value": `<https://themeforest.net/user/${item.buyer}|${item.buyer}>`,
                    },
                    {
                        "title": "Licence",
                        "value": item.license,
                    },
                    {
                        "title": "Remaining time",
                        "value": timeHelper.remainingTime(item.supported_until),
                    }
                ],
                "footer": "<http://slackato.com|Slackato>",
                "ts": (new Date()).getTime()
            }
        ]
    };
};

module.exports.error = (text) => {
    return {
        response_type: 'in_channel',
        'text': text,
        "attachments": [
            {
                "color": "#ff9800",
                "footer": "<http://slackato.com|Slackato>",
                "ts": (new Date()).getTime()
            }
        ]
    };
};

module.exports.info = (text) => {
    return {
        'text': text,
        "attachments": [
            {
                "color": "#9e9e9e",
                "footer": "<http://slackato.com|Slackato>",
                "ts": (new Date()).getTime()
            }
        ]
    };
};
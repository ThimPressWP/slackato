"use strict";

const timeHelper = global.helpers.time;

module.exports.verifySuccess = (item) => {
    return {
        response_type: "in_channel",
        "attachments": [
            {
                "fallback": item.name,
                "color": "#36a64f",
                "title": item.name,
                "title_link": item.url,
                "fields": [
                    {
                        "title": "Buyer",
                        "value": `<https://themeforest.net/user/${item.buyer}|${item.buyer}>`,
                    },
                    {
                        "title": "Remaining time",
                        "value": timeHelper.remainingTime(item.supported_until),
                    },
                    {
                        "title": "Licence",
                        "value": item.license,
                    }
                ],
                "footer": "<http://slackato.com|Slackato>",
                "ts": timeHelper.getNowTimestamp()
            }
        ]
    };
};

module.exports.error = (text) => {
    return {
        response_type: "in_channel",
        "attachments": [
            {
                "text": text,
                "fallback": text,
                "color": "#ff9800",
                "footer": "<http://slackato.com|Slackato>",
                "ts": timeHelper.getNowTimestamp()
            }
        ]
    };
};

module.exports.info = (text) => {
    return {
        "attachments": [
            {
                "text": text,
                "fallback": text,
                "color": "#9e9e9e",
                "footer": "<http://slackato.com|Slackato>",
                "ts": timeHelper.getNowTimestamp()
            }
        ]
    };
};
'use strict';

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
                        "title": "Supported Until",
                        "value": item.supported_until,
                    }
                ],
                "footer": "<http://slackato.com|Slackato>",
                "footer_icon": "https://a41e2ef2.ngrok.io/assets/images/logo.png",
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
                "footer_icon": "https://a41e2ef2.ngrok.io/assets/images/logo.png",
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
                "footer_icon": "https://a41e2ef2.ngrok.io/assets/images/logo.png",
                "ts": (new Date()).getTime()
            }
        ]
    };
};
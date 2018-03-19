'use strict';

let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);


const send = (args) => {
    let deferred = Promise.defer();

    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [
                        args.to,
                    ],
                    subject: args.subject
                },
            ],
            from: args.from,
            content: [
                {
                    type: 'text/html',
                    value: args.content
                },
            ],
        },
    });

    sg.API(request)
        .then(response => {
            return deferred.resolve(response);
        })
        .catch(error => {
            return deferred.reject(error);
        });

    return deferred.promise;
};

module.exports.sendFeedback = (content) => {
    let args = {
        from: {
            email: 'slackato@thimpress.com',
            name: 'Slackato',
        },
        to: {
            email: 'tutv95@gmail.com',
            name: 'Max'
        },
        subject: 'Feedback from slackato',
        content: content + "<hr><br>-- Slackato --"
    };

    return send(args);
};

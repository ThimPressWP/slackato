'use strict';

let slackSrv = require('../service/slack.api');

module.exports.callback = function (req, res, next) {
    let error = req.query.error || false;
    if (error) {
        res.redirect('/denied.html');
        return;
    }

    let code = req.query.code || false;
    slackSrv.getToken(code)
        .then(
            response => {
                res.json(response);
            },
            error => {
                res.status(500).json(error);
            }
        );
};
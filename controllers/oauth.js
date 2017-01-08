'use strict';

let slackSrv = require('../service/slack.api');
const Mongoose = require('mongoose');
const Chanel = Mongoose.model('Chanel');

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
                console.log(response);
                let newChanel = new Chanel(response);
                newChanel.save()
                    .then(
                        chanel => {
                            res.redirect(`/envato-auth/${chanel.team_id}`);
                        }
                    )
                    .catch(
                        error => {
                            res.send(error);
                        }
                    );
            },
            error => {
                res.redirect('/error.html');
            }
        );
};
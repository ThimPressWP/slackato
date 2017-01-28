'use strict';

let slackSrv = require('../service/slack.api');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');

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
                let newTeam = new Team(response);
                newTeam.save()
                    .then(
                        team => {
                            res.redirect(`/envato-oauth/${team.team_id}`);
                        }
                    )
                    .catch(
                        error => {
                            if (error.team_id) {
                                return res.redirect(`/envato-oauth/${error.team_id}`);
                            }

                            res.send(error);
                        }
                    );
            },
            error => {
                console.error(error);
                res.redirect('/error.html');
            }
        );
};
'use strict';

const envatoSrv = require('./envato');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');
const messageSrv = require('../service/slack.message');

function verify(teamID, code) {
    let deferred = Promise.defer();

    console.log('Verify purchase code:', code);

    Team.findOne({
        team_id: teamID
    })
        .then(
            team => {
                if (!team) {
                    return Promise.reject('Team not found');
                }

                if (!team.envato_token) {
                    return Promise.reject('Please oauth envato');
                }

                console.log('Team exist');

                return envatoSrv.getSaleByCode(code, team.envato_token);
            }
        )
        .then(
            result => {
                let post = messageSrv.verifySuccess(result);

                return deferred.resolve(post);
            }
        )
        .catch(
            error => {
                console.log('Get sale failed ', error);

                return deferred.reject(error);
            }
        );

    return deferred.promise;
}

function sendFeedback(content) {
    console.log(content);
}

module.exports.handle = (teamID, command) => {
    let deferred = Promise.defer();

    switch (command.name) {
        case 'verify':
            return verify(teamID, command.value);
            break;

        case 'feedback':
            sendFeedback(command.value);
            break;
    }

    return deferred.promise;
};
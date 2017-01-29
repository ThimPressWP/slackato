'use strict';

const commandHelper = global.helpers.command;
const envatoSrv = require('./envato');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');

function verify(teamID, code) {
    let deferred = Promise.defer();

    console.log('Verify purchase code:', code);

    Team.findOne({
        team_id: teamID
    })
        .then(
            team => {
                if (!team) {
                    deferred.reject('Team not found');
                }

                if (!team.envato_token) {
                    deferred.reject('Please oauth envato');
                }

                console.log('Team exist');

                return envatoSrv.getSaleByCode(code, team.envato_token);
            }
        )
        .then(
            result => {
                deferred.resolve(result);
            }
        )
        .catch(
            error => {
                console.log('Get sale failed ', error);

                deferred.reject(error);
            }
        );

    return deferred.promise;
}

function help() {
    let deferred = Promise.defer();

    deferred.resolve("*Guidelines*\n" +
        "- Verify purchase code:\n`/slackato verify purchase-code-abc-xyz`");

    return deferred.promise;
}

module.exports.handle = (postData) => {
    let deferred = Promise.defer();

    let teamID = postData.team_id || false;
    if (!teamID) {
        return deferred.reject('Something went wrong');
    }

    let commandText = postData.text || '';
    commandText = commandText.trim();

    let parsing = commandHelper.parseCommandText(commandText);
    if (!parsing) {
        deferred.reject("Hi! I am *Slackato* :)\nType `/slackato help` to see detail commands");
    }

    switch (parsing.name) {
        case 'verify':
            return verify(teamID, parsing.value);
            break;

        default:
            deferred.reject('Command not found. Type `/slackato help` to see detail commands');
            break;
    }

    return deferred.promise;
};
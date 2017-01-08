'use strict';

const q = require('q');

const command = global.helpers.command;
const envatoSrv = require('./envato');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');

function parseCommandText(text) {
    text = text.trim();

    if (!text) {
        return false;
    }

    let regex = /^\w+\s*/g;

    let matches = text.match(regex);
    if (!matches || !matches.length) {
        return false;
    }

    let name = matches[0];
    name = name.trim();
    let value = text.replace(regex, '');

    return {
        name,
        value
    }
}

function verify(teamID, code) {
    let deferred = q.defer();

    Team
        .findOne({
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

                return envatoSrv.getSaleByCode(code, team.envato_token);
            }
        )
        .catch(
            error => {
                console.log(error);

                deferred.reject(error);
            }
        );

    return deferred.promise;
}

module.exports.handle = (postData) => {
    let deferred = q.defer();

    let teamID = postData.team_id || false;
    if (!teamID) {
        return deferred.reject('Something went wrong');
    }

    let commandText = postData.text || '';
    commandText = commandText.trim();

    let parsing = parseCommandText(commandText);
    if (!parsing) {
        deferred.reject('Type `/slackato help` to see detail commands');
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
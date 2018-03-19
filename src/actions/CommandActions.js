const envatoSrv = require('../services/EnvatoServices');
const Team = require('../models/Team');
const SlackMessageServices = require('../services/SlackMessageServices');
const LinkServices = require('../services/LinkServices');
const MailServices = require('../services/MailServices');

function verify(teamID, code) {
    return Team
        .findOne({
            teamID: teamID
        })
        .then(team => {
            if (!team) {
                return Promise.reject('Team not found');
            }

            if (!team.envato_token) {
                return Promise.reject(`Please <${LinkServices.url('/envato-oauth/' + team.team_id)}|login with Envato> to use this feature.`);
            }

            console.log('Team exist');

            return envatoSrv.getSaleByCode(code, team);
        })
        .then(result => {
            let post = SlackMessageServices.verifySuccess(result);

            return Promise.resolve(post);
        })
        .catch(error => {
            console.log('Get sale failed ', error);

            return Promise.reject(error);
        });
}

function sendFeedback(content) {
    MailServices.sendFeedback(content)
        .then();
}

exports.handle = (teamID, command) => {
    switch (command.name) {
        case 'verify':
            return verify(teamID, command.value);

        case 'feedback':
            return sendFeedback(command.value);
    }

    return Promise.resolve(true);
};
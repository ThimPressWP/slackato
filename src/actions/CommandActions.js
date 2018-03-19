const envatoSrv = require('../services/EnvatoServices');
const Team = require('../models/Team');
const SlackMessageServices = require('../services/SlackMessageServices');
const LinkServices = require('../services/LinkServices');
const MailServices = require('../services/MailServices');

const _verify = (teamID, code) => {
    return Team
        .findOne({
            teamID: teamID
        })
        .then(team => {
            if (!team) {
                return Promise.reject('Team not found');
            }

            if (!team.envatoToken) {
                return Promise.reject(`Please <${LinkServices.url('/envato-oauth/' + team.teamID)}|login with Envato> to use this feature.`);
            }

            console.log('Team exist');

            return envatoSrv.getSaleByCode(code, team);
        })
        .then(result => {
            const post = SlackMessageServices.verifySuccess(result);

            return Promise.resolve(post);
        })
        .catch(error => {
            console.log('Get sale failed ', error);

            return Promise.reject(error);
        });
};

const _sendFeedback = (content) => {
    MailServices.sendFeedback(content)
        .then();
};

exports.handle = (teamID, command) => {
    switch (command.name) {
        case 'verify':
            return _verify(teamID, command.value);

        case 'feedback':
            return _sendFeedback(command.value);
    }

    return Promise.resolve(true);
};
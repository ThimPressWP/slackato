'use strict';

const commandSrv = require('../service/command');
const messageSrv = require('../service/slack.message');
const hookSrv = require('../service/slack.hook');
const linkSrv = require('../service/link');

const commandHelper = global.helpers.command;

module.exports.preHandleCommand = function (request, response, next) {
    let postData = request.body;
    let commandText = postData.text || '';
    let team_id = postData.team_id;

    //Set default command
    request.command = {name: false, value: false};

    let parsing = commandHelper.parseCommandText(commandText);
    if (!parsing) {
        return response.send("Hi! I am *Slackato* :)\nType `/slackato help` to see detail commands");
    }

    request.command = parsing;

    let responseText = '';
    switch (parsing.name) {
        case 'verify':
            responseText = `Searching for \`${parsing.value}\``;
            break;

        case 'help':
            responseText = "*Features*\n" +
                "- Verify purchase code:`/slackato verify purchase-code-abc-xyz`" +
                "\n- Send your feedback: `/slackato feedback example content`" +
                "\n*Settings*" +
                `\n- <${linkSrv.url('/envato-oauth/' + team_id)}|Login with another Envato account>`;
            break;

        case 'feedback':
            responseText = "Thank you for your feedback!  It helps the team understand which features and functionality are most important to you :)";
            break;

        default:
            responseText = 'Command not found. Type `/slackato help` to see detail commands';
            break;
    }

    response.send({
        text: responseText
    });

    next();
};


module.exports.handleCommand = function (req, res, next) {
    if (!req.command.name) {
        return;
    }

    let postData = req.body;
    let teamID = postData.team_id || false;
    if (!teamID) {
        return;
    }
    let response_url = postData.response_url || false;

    commandSrv.handle(teamID, req.command)
        .then(
            result => {
                return hookSrv.send(response_url, result);
            },
            error => {
                let data = messageSrv.error(error);

                return hookSrv.send(response_url, data);
            }
        )
        .then(
            response => {
                console.log('Send to hook:', response);
            }
        )
        .catch(
            error => {
                console.log(error);
            }
        );

    next();
};
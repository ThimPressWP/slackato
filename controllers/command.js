'use strict';

const commandSrv = require('../service/command');
const messageSrv = require('../service/slack.message');
const hookSrv = require('../service/slack.hook');

const commandHelper = global.helpers.command;


module.exports.handleCommand = function (req, res) {
    let postData = req.body;
    let commandText = postData.text || '';

    let parsing = commandHelper.parseCommandText(commandText);
    if (!parsing) {
        return res.send("Hi! I am *Slackato* :)\nType `/slackato help` to see detail commands");
    }

    let response_url = postData.response_url || false;

    res.send('Waiting...');

    commandSrv.handle(postData)
        .then(
            result => {
                let post = messageSrv.verifySuccess(result);

                return hookSrv.send(response_url, post);
            }
        )
        .then(
            response => {
                console.log(response);
            }
        )
        .catch(
            error => {
                console.error(error);
            }
        );
};
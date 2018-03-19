const messageSrv = require('../services/SlackMessageServices');
const SlackHookServices = require('../services/SlackHookServices');
const commandHelper = require('../helpers/command');
const CommandActions = require('../actions/CommandActions');
const getUrl = require('../helpers/getUrl');

exports.preHandleCommand = function (request, response, next) {
    const postData = request.body;
    const commandText = postData.text || '';
    const {team_id} = postData;

    //Set default command
    request.command = {name: false, value: false};

    const parsing = commandHelper.parseCommandText(commandText);
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
                `\n- <${getUrl('/envato-oauth/' + team_id)}|Login with another Envato account>`;
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


exports.handleCommand = function (req, res, next) {
    if (!req.command.name) {
        return;
    }

    const postData = req.body;
    const teamID = postData.team_id || false;
    if (!teamID) {
        return;
    }
    const response_url = postData.response_url || false;

    CommandActions.handle(teamID, req.command)
        .then(
            result => {
                return SlackHookServices.send(response_url, result);
            },
            error => {
                let data = messageSrv.error(error);

                return SlackHookServices.send(response_url, data);
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
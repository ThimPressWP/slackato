'use strict';

const commandSrv = require('../service/command');
const messageSrv = require('../service/slack.message');


module.exports.handleCommand = function (req, res) {
    let postData = req.body;

    commandSrv.handle(postData)
        .then(
            result => {
                if (result.name) {
                    return res.json(messageSrv.verifySuccess(result));
                }

                res.json(messageSrv.info(result));
            }
        )
        .catch(
            error => {
                res.json(messageSrv.error(error));
            }
        );
};
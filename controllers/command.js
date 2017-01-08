'use strict';

const commandSrv = require('../service/command');
const messageSrv = require('../service/slack.message');


module.exports.handleCommand = function (req, res, next) {
    let postData = req.body;

    commandSrv.handle(postData)
        .then(
            result => {
                if (result.name) {
                    return res.json(messageSrv.verifySuccess(result));
                }

                res.json(messageSrv.error(result));
            }
        )
        .catch(
            error => {
                console.log(error);
                res.send(error);
            }
        );
};
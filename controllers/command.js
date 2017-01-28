'use strict';

const commandSrv = require('../service/command');
const messageSrv = require('../service/slack.message');
const hookSrv = require('../service/slack.hook');


module.exports.handleCommand = function (req, res) {
    let postData = req.body;

    let response_url = postData.response_url;

    res.send('Waiting...');

    commandSrv.handle(postData)
        .then(
            result => {
                if (result.name) {
                    let post = messageSrv.verifySuccess(result);

                    hookSrv.send(response_url, post)
                        .then();
                }

                //res.json(messageSrv.info(result));
            }
        )
        .catch(
            error => {
                console.log('bbbbbbb', error);

                //res.json(messageSrv.error(error));
            }
        );
};
'use strict';

const commandSrv = require('../service/command');

module.exports.handleCommand = function (req, res, next) {
    let postData = req.body;

    commandSrv.handle(postData)
        .then(
            response => {
                res.json(response);
            }
        )
        .catch(
            error => {
                res.send(error);
            }
        );
};
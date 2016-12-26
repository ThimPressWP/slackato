'use strict';

module.exports.handleCommand = function (req, res, next) {
    console.log(req.body);

    res.send(req.body.text);
};
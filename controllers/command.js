'use strict';

module.exports.handleCommand = function (req, res, next) {
    let post_data = req.body;
    let command_text = post_data.text || '';
    command_text = command_text.trim();

    res.json({
        text: command_text
    });
};
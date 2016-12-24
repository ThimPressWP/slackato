'use strict';

const mongoose = require('mongoose');

module.exports = function () {
    let uri = process.env.APP_DB || 'mongodb://localhost/slackato';

    return new Promise((resolve, reject) => {
        mongoose.connect(uri, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve('Connected');
            }
        });
    });
};

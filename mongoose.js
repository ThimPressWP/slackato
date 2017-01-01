'use strict';

const Mongoose = require('mongoose');
const Glob = require('glob');

module.exports = function () {
    Mongoose.Promise = global.Promise;

    let uri = process.env.APP_DB || 'mongodb://localhost/slackato';

    return new Promise((resolve, reject) => {
        Mongoose.connect(uri, function (error) {
            if (error) {
                console.log(error);
                throw error;
            }
        });

        // If the node process ends, close the mongoose connection
        process.on('SIGINT', function () {
            Mongoose.connection.close(function () {
                console.log('Mongo Database disconnected through app termination');
                process.exit(0);
            });
        });

        // When the connection is disconnected
        Mongoose.connection.on('connected', function () {
            resolve('Mongo Database connected');
        });

        // When the connection is disconnected
        Mongoose.connection.on('disconnected', function () {
            reject(' Mongo Database disconnected');
        });

        // Load models
        let models = Glob.sync('models/*.js');
        models.forEach(function (model) {
            require('./' + model);
        });
    });
};

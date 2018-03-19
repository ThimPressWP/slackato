const Mongoose = require('mongoose');

Mongoose.set('debug', true);

/**
 * Connect to database.
 *
 * @param uri
 * @param options
 * @returns {Connection}
 */
module.exports = (uri, options = {}) => {
    if (!uri) {
        throw new Error("'uri' is required.");
    }

    // If the node process ends, close the mongoose connection
    process.on('SIGINT', () => {
        Mongoose.connection.close(() => {
            console.log('Mongo Database disconnected through app termination');
            process.exit(0);
        });
    });

    return Mongoose
        .createConnection(uri, options, () => {
            console.log('MongoDB is connected.');
        });
};

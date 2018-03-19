const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const conn = require('../app.database');

const Token = new Schema({
    access_token: {
        type: String,
        trim: true,
    },
    refresh_token: {
        type: String,
        trim: true,
    },
    expire_at: {
        type: Date,
        default: false,
    }
});

module.exports = conn.model('Token', Token);
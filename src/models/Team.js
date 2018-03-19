const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const conn = require('../app.database');

const Team = new Schema({
    teamName: {
        type: String,
    },
    teamID: {
        type: String,
        index: true,
    },
    bot: {
        type: Schema.Types.Mixed
    },
    slackToken: {
        type: String,
        trim: true,
    },
    envato_token: {
        type: Schema.Types.Mixed,
        default: false
    }
});

module.exports = conn.model('Team', Team);
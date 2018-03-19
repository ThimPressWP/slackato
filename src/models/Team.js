const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const conn = require('../app.database');

const Team = new Schema({
    access_token: {
        type: String,
        trim: true,
    },
    scope: {
        type: String
    },
    user_id: {
        type: String
    },
    team_name: {
        type: String,
    },
    team_id: {
        type: String,
        index: true,
    },
    bot: {
        type: Schema.Types.Mixed
    },
    envato_token: {
        type: Schema.Types.Mixed,
        default: false
    }
});

module.exports = conn.model('Team', Team);
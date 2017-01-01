'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Chanel = new Schema({
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
        type: String
    },
    team_id: {
        type: String
    },
    incoming_webhook: {
        type: Schema.Types.Mixed
    },
    bot: {
        type: Schema.Types.Mixed
    }
});

Mongoose.model('Chanel', Chanel);
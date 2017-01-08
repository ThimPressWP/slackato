'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Team = new Schema({
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
        unique: 'Team has already integrated!',
        index: true,
    },
    bot: {
        type: Schema.Types.Mixed
    },
    envato_token: {
        type: Schema.Types.Mixed,
        default: {
            access_token: false,
            refresh_token: false
        }
    }
});

Team.pre('save', function (next) {
    next();
});

Team.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Team has already integrated :)');
    } else {
        next();
    }
});

Mongoose.model('Team', Team);
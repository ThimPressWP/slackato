'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Chanel = new Schema({
    channel_id: {
        type: String,
        unique: 'Chanel has already integrated!',
        require: true,
    },
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
    },
    incoming_webhook: {
        type: Schema.Types.Mixed
    },
    bot: {
        type: Schema.Types.Mixed
    }
});

Chanel.pre('save', function (next) {
    this.channel_id = this.incoming_webhook.channel_id;
    next();
});

Chanel.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Chanel has already integrated :)');
    } else {
        next();
    }
});

Mongoose.model('Chanel', Chanel);
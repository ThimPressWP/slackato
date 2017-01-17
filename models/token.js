'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Token = new Schema({
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

Mongoose.model('Token', Token);
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const q = require('q');

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
        next(doc);
    } else {
        next();
    }
});

Team.statics.saveEnvatoTokenByTeamID = function (teamID, token) {
    let deferred = q.defer();

    this.model('Team').findOneAndUpdate({team_id: teamID}, {$set: {envato_token: token}}, (error, old) => {
        if (error) {
            deferred.reject(error);
        }

        deferred.resolve(true);
    });

    return deferred.promise;
};

Mongoose.model('Team', Team);
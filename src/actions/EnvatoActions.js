const EnvatoServices = require('../services/EnvatoServices');
const Team = require('../models/Team');

exports.redirectAuth = (teamID) => {
    const url = EnvatoServices.getUrlAuth();

    return Promise.resolve(url);
};

exports.callback = (teamID, code) => {
    return EnvatoServices
        .getToken(code)
        .then(token => {
            return Team.updateOne({
                teamID,
            }, {
                $set: {
                    envatoToken: token
                }
            }).then(() => Team.findOne({teamID}));
        });
};
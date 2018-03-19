const SlackAPIServices = require('../services/SlackAPIServices');
const Team = require('../models/Team');

exports.callback = (code) => {
    return SlackAPIServices.getAccessToken(code)
        .then(response => {
            const newTeam = new Team(response);
            return newTeam.save();
        })
        .then(team => {

        });
};
const SlackAPIServices = require('../services/SlackAPIServices');
const Team = require('../models/Team');

exports.callback = (code) => {
    return SlackAPIServices.getAccessToken(code)
        .then(response => {
            const {access_token, team_name, team_id} = response;

            return Team.findOne({
                teamID: team_id,
            }).then(team => {
                if (!team) {
                    const newTeam = new Team({
                        teamID: team_id,
                        teamName: team_name,
                        slackToken: access_token
                    });

                    return newTeam.save()
                        .then(team => {
                            console.log('[NEW_TEAM]', team.toObject());

                            return Promise.resolve(team);
                        });
                }

                return team.update({
                    $set: {
                        slackToken: access_token,
                        teamName: team_name
                    }
                }).then(() => Team.findOne({teamID: team_id}));
            });
        });
};
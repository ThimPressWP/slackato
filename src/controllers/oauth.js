const slackSrv = require('../services/SlackAPIServices');
const Team = require('../models/Team');

exports.callback = (req, res) => {
    const error = req.query.error || false;
    if (error) {
        return res.redirect('/denied.html');
    }

    const code = req.query.code || false;
    slackSrv.getToken(code)
        .then(
            response => {
                console.log(response);
                const newTeam = new Team(response);
                newTeam.save()
                    .then(
                        team => {
                            res.redirect(`/envato-oauth/${team.team_id}`);
                        }
                    )
                    .catch(
                        error => {
                            if (error.team_id) {
                                return res.redirect(`/envato-oauth/${error.team_id}`);
                            }

                            res.send(error);
                        }
                    );
            },
            error => {
                console.error(error);
                res.redirect('/error.html');
            }
        );
};
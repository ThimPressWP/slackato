const envatoSrv = require('../services/EnvatoServices');
const Team = require('../models/Team');

exports.redirectAuth = (req, res) => {
    const teamID = req.params.teamID || false;

    if (!teamID) {
        return res.redirect('/error.html');
    }

    /**
     * Store teamID to session.
     */
    req.session.teamID = teamID;

    const url = envatoSrv.getUrlAuth();
    res.redirect(url);
};

exports.handleCallback = (req, res) => {
    const error = req.query.error || false;
    if (error) {
        const message = req.query.error_description || 'Access denied';
        return res.send(message);
    }

    const code = req.query.code || false;

    if (!code) {
        return res.redirect('/error.html');
    }

    envatoSrv.getToken(code)
        .then(
            token => {
                const teamID = req.session.teamID;

                return Team.saveEnvatoTokenByTeamID(teamID, token);
            }
        )
        .then(
            message => {
                res.redirect('/done.html');
            }
        )
        .catch(
            error => {
                console.error(error);
                res.redirect('/error.html');
            }
        );
};
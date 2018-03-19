const envatoSrv = require('../service/envato');
const Mongoose = require('mongoose');
const Team = Mongoose.model('Team');

module.exports.redirectAuth = (req, res) => {
    let teamID = req.params.teamID || false;

    if (!teamID) {
        return res.redirect('/error.html');
    }

    /**
     * Store teamID to session.
     */
    req.session.teamID = teamID;

    let url = envatoSrv.getUrlAuth();
    res.redirect(url);
};

module.exports.handleCallback = (req, res) => {
    let error = req.query.error || false;
    if (error) {
        let message = req.query.error_description || 'Access denied';
        return res.send(message);
    }

    let code = req.query.code || false;

    if (!code) {
        return res.redirect('/error.html');
    }

    envatoSrv.getToken(code)
        .then(
            token => {
                let teamID = req.session.teamID;

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
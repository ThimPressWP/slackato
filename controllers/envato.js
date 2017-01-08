'use strict';

const envatoSrv = require('../service/envato');

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
    let code = req.params.code || false;

    console.log(req.params);

    if (!code) {
        return res.redirect('/error.html');
    }

    envatoSrv.getToken(code)
        .then(
            test => {
                res.json(test);
            }
        )
        .catch(
            error => {
                res.redirect('/error.html');
            }
        );
};
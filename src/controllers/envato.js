const EnvatoActions = require('../actions/EnvatoActions');

exports.redirectAuth = (req, res) => {
    const {teamID} = req.params;

    if (!teamID) {
        return res.redirect('/error.html');
    }

    /**
     * Store teamID to session.
     */
    req.session.teamID = teamID;

    EnvatoActions.redirectAuth(teamID)
        .then(url => {
            res.redirect(url);
        })
        .catch((error) => {
            console.error(error);

            return res.redirect('/error.html');
        });
};

exports.handleCallback = (req, res) => {
    const {error, error_description, code} = req.query || false;
    if (error) {
        const message = error_description || 'Access denied';

        return res.send(message);
    }

    if (!code) {
        return res.redirect('/error.html');
    }

    const {teamID} = req.session;

    console.log(req.session);

    if (!teamID) {
        return res.send('Session is expired.');
    }

    return EnvatoActions.callback(teamID, code)
        .then(() => {
            return res.redirect('/done.html');
        })
        .catch(error => {
            console.error(error);

            return res.redirect('/error.html');
        });
};
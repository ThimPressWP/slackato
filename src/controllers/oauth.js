const OathActions = require('../actions/OauthActions');

exports.callback = (req, res) => {
    const {error, code} = req.query;

    if (error) {
        return res.redirect('/denied.html');
    }

    OathActions.callback(code)
        .then(team => {
            const teamId = team.get('teamID');

            return res.redirect(`/envato-oauth/${teamId}`);
        })
        .catch(error => {
            console.error(error);

            res.redirect('/error.html');
        });
};
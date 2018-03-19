const OathActions = require('../actions/OauthActions');

exports.callback = (req, res) => {
    const {error, code} = req.query;

    if (error) {
        return res.redirect('/denied.html');
    }

    return res.send(code);

    OathActions.callback(code)
        .then(team => {
            const teamId = team.get('team_id');
            return res.redirect(`/envato-oauth/${teamId}`);
        })
        .catch(error => {
            console.error(error);

            res.redirect('/error.html');
        });
};
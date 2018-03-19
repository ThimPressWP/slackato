const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const getEnv = require('./helpers/getEnv');
const uuid = require('uuid/v4');

const app = express();

/**
 * Express configuration.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', 1);
app.use(session({
    secret: '_5l2ck2tO__s3cr3t_',
    cookie: {
        secure: true,
        maxAge: 60000
    },
    genid: (req) => {
        return uuid();
    }
}));

/**
 * Config serve static files.
 */
app.use(express.static(__dirname + '/../public'));

/**
 * Config routes.
 */
app.use(require('./routes'));

const port = getEnv('/port');
const host = getEnv('/host');
app.listen(port, () => {
    console.log('HOST:', host);

    console.log('App listening on port ' + port);
});
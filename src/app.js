const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const getEnv = require('./helpers/getEnv');

const app = express();

/**
 * Express configuration.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', 1);
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 60000
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
app.listen(port, () => {
    console.log('App listening on port ' + port);
});
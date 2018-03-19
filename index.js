require('dotenv').config();
require('./helpers');

const express = require('express');
const app = express();
const session = require('express-session');

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

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

const database = require('./mongoose.js');
database()
    .then(
        (message) => {
            console.log(message);
            initServer();
        }
    )
    .catch(
        error => {
            console.log(error);
        }
    );


function initServer() {
    let routes = require('./routes');
    app.use(routes);

    let port = process.env.HOST_PORT || 7878;
    app.listen(port, () => {
        console.log('App listening on port ' + port);
    });
}
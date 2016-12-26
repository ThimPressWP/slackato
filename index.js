'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));

let oathCtrl = require('./controllers/oauth');
let commandCtrl = require('./controllers/command');
app.get('/oauth', oathCtrl.callback);
app.post('/command', commandCtrl.handleCommand);

const database = require('./app.databases');
database()
    .then(
        () => {
            console.log('Database connected');
            listen();
        },
        error => {
            console.log(error);
        }
    );

app.use(express.static(__dirname + '/public'));

function listen() {
    let port = process.env.HOST_PORT || 7878;
    app.listen(port, () => {
        console.log('App listening on port ' + port);
    });
}
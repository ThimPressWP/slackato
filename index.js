'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

let oathCtrl = require('./controllers/oauth');
app.get('/oauth', oathCtrl.callback);

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
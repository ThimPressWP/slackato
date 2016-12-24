'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

require('./app.databases');

app.use(express.static(__dirname + '/public'));

let oathCtrl = require('./controllers/oauth');

app.get('/oauth', oathCtrl.callback);

let port = process.env.HOST_PORT || 7878;
app.listen(port, () => {
    console.log('App listening on port ' + port);
});
'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

let oathCtrl = require('./controllers/oauth');

app.get('/', (req, res, next) => {
    res.send('Hello');
});

app.get('/oauth', oathCtrl.callback);

let port = process.env.HOST_PORT || 7878;
app.listen(port, () => {
    console.log('App listening on port ' + port);
});
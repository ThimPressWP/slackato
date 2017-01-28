'use strict';

const express = require('express');
const router = express.Router();

let oathCtrl = require('./controllers/oauth');
let commandCtrl = require('./controllers/command');
let envatoCtrl = require('./controllers/envato');

module.exports = router
    .get('/oauth', oathCtrl.callback)
    .post('/command', commandCtrl.handleCommand)

    .get('/envato-oauth/:teamID', envatoCtrl.redirectAuth)
    .get('/envato', envatoCtrl.handleCallback);
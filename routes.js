'use strict';

const express = require('express');
const router = express.Router();

let oathCtrl = require('./controllers/oauth');
let commandCtrl = require('./controllers/command');

module.exports = router
    .get('/oauth', oathCtrl.callback)
    .post('/command', commandCtrl.handleCommand);
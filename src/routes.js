const express = require('express');
const router = express.Router();

const oathCtrl = require('./controllers/oauth');
const commandCtrl = require('./controllers/command');
const envatoCtrl = require('./controllers/envato');

router.get('/oauth', oathCtrl.callback);
router.post('/command', commandCtrl.preHandleCommand, commandCtrl.handleCommand);

router.get('/envato-oauth/:teamID', envatoCtrl.redirectAuth);
router.get('/envato', envatoCtrl.handleCallback);

module.exports = router;
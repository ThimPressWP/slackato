'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

let port = process.env.HOST_PORT || 7878;
app.listen(port, () => {
    console.log('App listening on port ' + port);
});
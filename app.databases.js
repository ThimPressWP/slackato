'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/slackato');

global.mongodb = mongoose;
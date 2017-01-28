'use strict';

const Glob = require('glob');

/**
 * Init helpers.
 */
global.helpers = {};

// Load helpers
let helpers = Glob.sync('helpers/*.js');
helpers.forEach(function (file) {
    require('./' + file);
});
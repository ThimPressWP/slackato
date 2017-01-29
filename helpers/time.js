'use strict';

const moment = require('moment');

let time = {};

time.remainingTime = (expirationTime) => {
    let exp = new Date(expirationTime);
    let now = new Date();
    let diff = exp.getTime() - now.getTime();

    if (diff <= 0) {
        return 'Expired';
    }

    let duration = moment.duration(diff, 'ms');

    return duration.humanize();
};

global.helpers.time = time;
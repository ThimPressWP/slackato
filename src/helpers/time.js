const moment = require('moment');

exports.remainingTime = (expirationTime) => {
    const exp = new Date(expirationTime);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();

    if (diff <= 0) {
        return 'Expired';
    }

    const duration = moment.duration(diff, 'ms');

    return duration.humanize();
};

exports.getNowTimestamp = () => {
    let now = new Date();

    return parseInt(now.getTime() / 1000, 10);
};
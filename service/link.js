'use strict';

const host = process.env.HOST;

module.exports.url = (sub) => {
    return host + sub;
};
'use strict';

let command = {};

command.parseCommandText = (text) => {
    text = text.trim();

    if (!text) {
        return false;
    }

    let regex = /^\w+\s*/g;

    let matches = text.match(regex);
    if (!matches || !matches.length) {
        return false;
    }

    let name = matches[0];
    name = name.trim();
    let value = text.replace(regex, '');

    return {
        name,
        value
    }
};

global.helpers.command = command;
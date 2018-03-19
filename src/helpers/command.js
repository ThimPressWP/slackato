exports.parseCommandText = (text) => {
    text = text.trim();

    if (!text) {
        return false;
    }

    const regex = /^\w+\s*/g;

    const matches = text.match(regex);
    if (!matches || !matches.length) {
        return false;
    }

    let name = matches[0];
    name = name.trim();
    const value = text.replace(regex, '');

    return {
        name,
        value
    }
};
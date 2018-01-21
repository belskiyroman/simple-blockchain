const sha256 = require('sha256');

module.exports = function hash(...args) {
    return sha256(args);
};
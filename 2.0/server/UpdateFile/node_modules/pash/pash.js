var crypto = require("crypto");

var pash = function (password, salt, callback) {
    "use strict";
    if (!password) {
        handleError("No password supplied", callback);
        return;
    }
    if (!salt) {
        handleError("No salt supplied", callback);
        return;
    }
    return crypto.pbkdf2(password, salt, 10000, 64, complete.bind(null, callback));
};

var complete = function (callback, error, derivedKey) {
    if (error) {
        handleError(error, callback);
        return;
    }
    if (typeof (callback) === "function") {
        return callback(new Buffer(derivedKey));
    }
};

var handleError = function (error, callback) {
    if (typeof (callback) === "function") {
        return callback(error);
    }
    throw error;
};

if (typeof (module) !== "undefined" && module.exports) {
    module.exports = pash;
}

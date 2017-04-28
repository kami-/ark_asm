const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const JWT_ALGORITHM = "HS265";
let JWT_SECRET;

function init(callback) {
    crypto.randomBytes(256, (err, buf) => {
        if (err) { throw err; }
        JWT_SECRET = buf.toString();
        callback();
    });
}

function createTokenForUser(username) {
    return jwt.sign({
        username: username,
        iat: Math.floor(Date.now() / 1000)
    }, JWT_SECRET);
}

function isValidTokenForUser(token, users) {
    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
        if (payload && users.indexOf(payload.username) >= 0) {
            return true;
        }
    } catch (err) {
        return false;
    }
    return false;
}

module.exports = {
    init: init,
    createTokenForUser: createTokenForUser,
    isValidTokenForUser: isValidTokenForUser
};
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../public/constants');

function verifyToken(token) {
    try {
        if (jwt.verify(token, JWT_SECRET)) {
            return true
        }
    } catch (e) {
        return null;
    }

}

module.exports = verifyToken
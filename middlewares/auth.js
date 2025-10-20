const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../public/constants');

function auth(req, res, next){
    const token = req.cookies.token;

    try {
        const verifyResult = jwt.verify(token, JWT_SECRET)

        req.user = {
            email: verifyResult.email
        }

        next();
        console.log(verifyResult)
    } catch (e) {
        res.redirect('/staff');
    }
}

module.exports = auth
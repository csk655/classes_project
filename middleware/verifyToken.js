var jwt = require('jsonwebtoken');
var constants = require('../constant/constant');
var secretKey = constants.jwtSecretKey.secret;

var verifyToken = function (req, res, next) {

    // req.headers['token']

    //req.headers.authorization 
    //authorization.split(' ')[1]
    var authorization = req.headers.authorization, decoded;

    try {
        decoded = jwt.verify(authorization.split(' ')[1], secretKey)

    } catch (e) {
        console.log("Unauthorized - "+e)
        return res.status(401).send(JSON.stringify({ error: true, message: 'Unauthorized'}));
    }

    var email = decoded.email
    console.log(`JWT verified and email is ${email}`)
    next();

};


module.exports = verifyToken;
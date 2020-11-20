const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from the headers
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
        return res.status(401).json({ errors: [{ msg: "Account does not have permission to view requested page" }]})
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('JWT_SECRET'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ errors: [{ msg: "Token is not valid" }]});
    }
}
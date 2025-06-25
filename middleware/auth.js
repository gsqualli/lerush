const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authCookie = req.cookies['authorization']
    const token = authCookie && authCookie.split(' ')[1]
    if(token == null) return res.status(401).send("no token")

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
        if (err) return res.status(403).send("invalid token")
        req.admin = admin
        next()
    })
}

module.exports = authenticateToken;
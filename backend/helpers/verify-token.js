const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//middleware vaidation TOKEN
const checkToken = (req, res, next ) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Acesso Restrito!'})
        
    }
        const token = getToken(req)

    if (!token) {
        return res.status(401).json({message: 'Acesso Restrito!'})
        
    }
    try {

        const verified = jwt.verify(token, 'nossosecret') 
        req.user = verified
        next()
             
    } catch (err) {
        return res.status(400).json({message: 'Token Invalido!'})
    }

}
module.exports = checkToken
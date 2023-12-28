const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const isAuth = async(req, res, next)=> {
try {
   // check if the user has a token = authentification
const token = req.headers["x-auth-token"] 
if (!token) {
    return res.status(404).send({message: "user not authentificated"})
}  
// extract the id from the token
const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
const id = decodedToken.userId
let user = await User.findById(id)
req.user = user
next()
} catch (error) {
   res.status(500).send({message: error.message}) 
}
}
module.exports = isAuth;
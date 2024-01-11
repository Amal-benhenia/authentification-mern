const express = require('express')
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isAuth = require('../Middleware/auth')
// require router
const router = express.Router()

//register a new user
//http://localhost:3000/api/user/register

router.post('/register', async(req, res)=> {
// step 1: add a new user
    //get the data from teh req body
const {userName,email,password,role } = req.body
try {
    // check if the email is reserved 
   let user = await User.findOne({email})
   if(user) {
    return res.status(400).send({message: "this email is already reserved"})
   }
   // create a hashed password 
const hashedPassword = await bcrypt.hash(password, 10)

  // create the new user
user = new User({userName, email, password: hashedPassword, role})
  // save the new user
await user.save()
//2 assign a token to the created user

const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY)

// send the response 
res.status(201).send({user, token})
} catch (error) {
   res.status(400).send({message: error.message})
}
} )

//login a user
//http://localhost:3000/api/user/login

router.post('/login', async (req, res)=> {
//get user data
const {email, password} = req.body
try {
 // check if the email exists in the DB
 let user =  await User.findOne({email})
 if(!user) {
return res.status(404).send({message: 'This email has no account..'})
 }
 const isMacth = await bcrypt.compare(password, user.password )
if (!isMacth) {
  return res.status(400).send({message: "Password incorrect"})
}
// create a token
const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {
  expiresIn: "7 days"
})
// send the response 
res.status(200).send({user, token})
} catch (error) {
  res.status(500).send({message: error.message})
}

})
// getting the authentificated user
//http://localhost:3000/api/user/profile

router.get('/profile',isAuth, async(req, res)=> {
  try {
    res.status(200).send({user : req.user})
  } catch (error) {
    res.status(500).send({message: error.message})
  }
} )

// get all users
//http://localhost:5000/api/user/all

router.get('/all',isAuth, async(req, res)=> {
try {
  if (req.user.role !== "admin") {
    return res.status(401).send({message: "Unauthorized access"})
  }
  const user = req.user
 const users = await User.find()
 if (!users) return res.status(404).send({message: "no users found"})
 res.status(200).send({users, user})
} catch (error) {
  res.status(500).send({message: error.message})
}
})

module.exports = router
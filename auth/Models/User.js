const mongoose = require('mongoose')

const schema = mongoose.Schema

// create thh schema

const userSchema = new schema({
    userName : {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    }
})
module.exports = mongoose.model('User',userSchema )
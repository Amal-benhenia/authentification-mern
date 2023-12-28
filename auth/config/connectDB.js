const mongoose = require('mongoose')

const connectDB = ()=> {
    mongoose.connect(process.env.MONGODB_URL)
    const db = mongoose.connection
    db.on('error', ()=> {
        console.log('connection failure')
    })
}

module.exports = connectDB
// create the server
const express = require('express')
const userRoutes = require('./routes/user')
const cors = require('cors');
const app = express()
const port = 5000
require('dotenv').config()

//connect the DB
const connectDB = require('./config/connectDB')
connectDB()
app.use(cors())
app.use(express.json())
app.use('/api/user',userRoutes )

app.listen(port, ()=> {
    console.log(`server running on port ${port}`)
})
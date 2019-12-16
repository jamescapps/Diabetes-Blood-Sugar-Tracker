require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json())

//Connect to database.
//mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect('mongodb://localhost/blood_sugar_tracker', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
    console.log("Connected to database!")
})


const usersRouter = require('./routes/users')
const bloodsugarRouter = require('./routes/bloodsugar')

app.use('/users', usersRouter)
app.use('/bloodsugar', bloodsugarRouter)



app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running!")
})
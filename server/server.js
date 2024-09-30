require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const passport = require('passport')
const app = express()
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(passport.initialize())
require('./config/passport')
app.use(helmet())
app.use(helmet.noSniff())
app.use(helmet.xssFilter())

//Connect to database.
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })

//Test connection
mongoose.connection.once('open', () => {
    console.log("Connected to database!")
})

const registrationRouter = require('./routes/userRegistration')
const readingsRouter = require('./routes/readings')
const loginRouter = require('./routes/login')
const passwordUpdateRoutes = require('./routes/password')

app.use('/registration', registrationRouter)
app.use('/readings', readingsRouter)
app.use('/login', loginRouter)
app.use('/password', passwordUpdateRoutes);


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}  


app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running!")
})
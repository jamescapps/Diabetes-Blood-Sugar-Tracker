const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")

const login = async (req, res) => {
    const { email, password } = req.body
    const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!emailValidate.test(email)) {
        return res.status(400).send("Invalid email format")
    }

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).send("Email does not exist. Please register.")
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).send("Incorrect password")
        }

        const payload = {
            id: user.id,
            name: user.firstname
        }

        // Sign JWT token
        const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: '1y' }) 
        return res.json({ success: true, token: token })

    } catch (err) {
        console.error('Error during login: ', err)
        return res.status(500).send("Error processing request.")
    }
}

module.exports = {
    login
}


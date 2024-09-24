const bcrypt = require('bcrypt')
const User = require('../models/user.model')

// Email and name validation regex
const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const nameCheck = /^[a-zA-Z ]+$/

// Helper function to validate user input
const isValidInput = (firstname, lastname, email, password1, password2) => {
    if (!nameCheck.test(firstname)) return "Please enter a valid first name."
    if (!nameCheck.test(lastname)) return "Please enter a valid last name."
    if (!emailValidate.test(email)) return "Please enter a valid email."
    if (password1 !== password2 || password1 === "" || password2 === "") {
        return "Please make sure passwords match."
    }
    return null
}

const registerUser = async (req, res) => {
    const { firstname, lastname, email, password1, password2 } = req.body
    const validationError = isValidInput(firstname, lastname, email, password1, password2)

    if (validationError) {
        return res.send(validationError)
    }

    try {
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.send("Email already in use.")
        }

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: password2,
            resetPasswordToken: '',
            tokenExpiration: Date.now(),
        })

        // Hash password before saving to database
        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(newUser.password, salt)
        await newUser.save()

        return res.json('User added! Redirecting you to login page!')
    } catch (err) {
        console.error('Error during user registration: ', err)
        return res.status(400).json('Error: ' + err)
    }
}

module.exports = {
    registerUser
}

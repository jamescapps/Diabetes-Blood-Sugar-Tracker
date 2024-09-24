require('dotenv').config();
const User = require('../models/user.model')
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUNDS = 12

const forgotPassword = (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).send("Please enter your email.")
    }

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(404).send("Email does not exist. Please register.")
        }

        const token = crypto.randomBytes(20).toString('hex')

        user.resetPasswordToken = token;
        user.tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

        user.save().then(() => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            const mailMessage = {
                from: process.env.EMAIL_ADDRESS,
                to: user.email,
                subject: 'Password Reset Link',
                text: `
                    You are receiving this email because there has been a request to reset your password.
                    Please click on the following link or paste it in your browser within one hour: 
                    https://dry-savannah-15034.herokuapp.com/resetpassword/reset/${token}
                    If you did not make this request, disregard this email.
                `
            }

            transporter.sendMail(mailMessage, (err) => {
                if (err) {
                    console.error('There was an error sending the email: ', err)
                    return res.status(500).send("Error sending recovery email.")
                }
                res.send("Recovery email has been sent. Please check your inbox.")
            })
        })
    }).catch(err => {
        console.error('Database error: ', err);
        res.status(500).send("An error occurred while processing your request.");
    })
}

const validateResetToken = (req, res) => {
    const { resetPasswordToken } = req.query

    User.findOne({
        resetPasswordToken: resetPasswordToken,
        tokenExpiration: { $gt: Date.now() }
    })
    .then(user => {
        if (!user) {
            return res.status(400).send("Password reset link is invalid or has expired.")
        }
        res.send({
            email: user.email,
            message: 'Password reset link is valid.'
        })
    })
    .catch(err => {
        console.error('Database error: ', err);
        res.status(500).send("An error occurred while validating the reset token.")
    })
}

const updatePasswordViaEmail = (req, res) => {
    const { email, password1, password2 } = req.body

    if (password1 !== password2) {
        return res.status(400).send("Please make sure your passwords match.")
    }

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            console.error('Error contacting database: ', err)
            return res.status(500).send("Error contacting database.")
        }

        if (!user) {
            return res.status(404).send("User not found.")
        }

        // Hash the new password
        bcrypt.hash(password2, BCRYPT_SALT_ROUNDS, (err, hash) => {
            if (err) {
                console.error('Error hashing password: ', err)
                return res.status(500).send("Error processing password.")
            }

            user.password = hash
            user.save()
                .then(() => res.json('Password updated! Redirecting you to the login page!'))
                .catch(err => {
                    console.error('Error saving new password: ', err)
                    res.status(400).json({ error: 'Error updating password.' })
                })
        })
    })
}

module.exports = {
    forgotPassword,
    validateResetToken,
    updatePasswordViaEmail
}
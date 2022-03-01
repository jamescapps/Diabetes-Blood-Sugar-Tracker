require('dotenv').config()

const router     = require('express').Router()
let User         = require('../models/user.model')
const nodemailer = require('nodemailer')
const crypto     = require("crypto")


router.route('/forgotpassword').post((req, res) => {
    const { email } = req.body

    if (email === '') {
        res.send ("Please enter your email.")
    }

    User.findOne({email: email}).then(user => {
        if (!user) {
            res.send("Email does not exist. Please register.")
        } else {
            const token = crypto.randomBytes(20).toString('hex')

            user.resetPasswordToken = token
            user.tokenExpiration = Date.now() + 3600000,
            user.save()
 
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: `${process.env.EMAIL_ADDRESS}`,
                    pass: `${process.env.EMAIL_PASSWORD}`
                }
            })

            const mailMessage = {
                from: `bloodsugartracker00@gmail.com`,
                to: `${user.email}`,
                subject: `Password Reset Link`,
                text:
                `You are receiving this email because there has been a request to reset your password.\n`
                + `Please click on the following link or paste it in your browser within one hour: \n`
                + `https://dry-savannah-15034.herokuapp.com/resetpassword/reset/${token} \n\n`
                + `If you did not make this request, disregard this email.\n`
            }

           transporter.sendMail(mailMessage, (err, res) => {
                if (err) {
                    console.error('there was an error: ', err)
                } 
            })
            res.send("Recovery email has been sent.  Please check your inbox.")
        }
    })
})


module.exports = router
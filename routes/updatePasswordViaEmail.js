const router = require('express').Router()
const User   = require('../models/user.model')
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUNDS = 12

router.route('/updatepasswordviaemail').post((req, res) => {
    User.findOne({email: req.body.email}, (err, result) => {
        if (err) {
            res.send("Error contacting database")
        } else if (!result) {
            res.send("User not found.")
        } else if (req.body.password1 === req.body.password2) {
            bcrypt.hash(req.body.password2, BCRYPT_SALT_ROUNDS, (err, hash) => {
                if (err) {
                    res.send("crypt err lv 2!")
                } else {
                    result.password = hash;
                    result.save()
                        .then(() => res.json('Password updated! Redirecting you to login page!'))
                        .catch(err => res.status(400).json('Error: ' + err))
                }
            })
        } else {
            res.send("Please make sure your passwords match.")
        }
    })
})


module.exports = router
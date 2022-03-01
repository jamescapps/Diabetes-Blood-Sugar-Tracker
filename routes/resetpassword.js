const router = require('express').Router()
let User     = require('../models/user.model')


router.route('/reset').get((req, res) => {
    User.findOne({
            resetPasswordToken: req.query.resetPasswordToken,
            tokenExpiration: {
                $gt: Date.now()
            }
        }).then(user => {
            if (!user) {
                res.send("Password reset link is invalid or has expired.")
            } else {
                res.send({
                    email: user.email,
                    message: 'Password reset link ok.'
                })
            }
        })
    })


module.exports = router
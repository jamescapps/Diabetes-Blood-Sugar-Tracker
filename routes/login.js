const bcrypt = require('bcrypt')
const router = require('express').Router()
let User     = require('../models/user.model')
const jwt    = require("jsonwebtoken")
const keys   = require("../config/keys")


router.route('/login').post((req, res) => {
    const { email }     = req.body
    const { password }  = req.body
    const emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (emailValidate.test(email)) {
        User.findOne({email: email}).then(user => {
             if (!user) {
                res.send("Email does not exist. Please register.")
            } else {
                bcrypt.compare(password, user.password).then((result) => {
                  if (result) {
                        const payload = {
                            id: user.id,
                            name: user.firstname
                  }
                  jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                      expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                      res.json({
                        success: true,
                        token: token
                      });
                    }
                  )
                }
                    else {
                        return res.send("Incorrect password")
                    }
                })
            }
        })
    } else {
        res.send("Invalid email format")
    }
})

module.exports = router
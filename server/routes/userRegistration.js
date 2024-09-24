const router = require('express').Router()
const { registerUser } = require('../controllers/registration')

router.post('/add', registerUser)

module.exports = router

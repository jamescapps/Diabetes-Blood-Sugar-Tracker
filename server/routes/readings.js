const router = require('express').Router()
const { addReading, deleteReading, getUserData } = require('../controllers/readings')

router.get('/', getUserData)

router.post('/add', addReading)

router.delete('/:userId/:readingId', deleteReading)

module.exports = router

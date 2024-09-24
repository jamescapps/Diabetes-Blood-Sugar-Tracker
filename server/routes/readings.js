const router = require('express').Router();
const { getUsers, addReading, deleteReading } = require('../controllers/readings');

router.get('/', getUsers);

router.post('/add', addReading);

router.delete('/:userId/:readingId', deleteReading);

module.exports = router;

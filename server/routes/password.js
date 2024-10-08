const router = require('express').Router();
const { forgotPassword, validateResetToken, updatePassword } = require('../controllers/password');

router.post('/forgotpassword', forgotPassword);

router.post('/reset', validateResetToken)

router.post('/update', updatePassword)

module.exports = router;

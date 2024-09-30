const router = require('express').Router();
const { forgotPassword, validateResetToken, updatePasswordViaEmail } = require('../controllers/password');

router.post('/forgotpassword', forgotPassword);

router.post('/reset', validateResetToken)

router.post('/update', updatePasswordViaEmail)

module.exports = router;

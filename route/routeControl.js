const express = require('express');
const registerPostutme = require('../controler/appregistration');
// const applicationlogin = require('../controler/applogin');

const router = express.Router();

router.post('/postutmereg', registerPostutme.applicationFormreg);
router.post('/postutmeyear', registerPostutme.postutmeyear);
// router.post('/postutmereg', applicationlogin.applogin);
router.post('/otp', registerPostutme.otptest);
router.post('/login', registerPostutme.postutmeLogin);
router.post('/resetpassword', registerPostutme.passwordReset);
router.post('/verifyotp', registerPostutme.verifyotp);
router.post('/changepass', registerPostutme.changepass);
router.post('/jambcheck', registerPostutme.jambCheck);
router.post('/jamblinking', registerPostutme.jambLinking);
router.post('/updatepostutmereg', registerPostutme.updatePostutmeReg);
router.post('/fetchdata', registerPostutme.fetchRegData);
router.post('/otpreset', registerPostutme.otpreset);
router.post('/stagecheck', registerPostutme.stageCheck);
router.post('/jambreg', registerPostutme.jambReg);
router.post('/updateform', registerPostutme.updateForm1);

module.exports = router;

const express = require('express');
const router = express.Router();
const { userSignUp, login, logOut } = require('../controllers/user')

router.post('/signup', userSignUp);
router.post('/login', login);
router.post('/logOut', logOut);


module.exports = router;
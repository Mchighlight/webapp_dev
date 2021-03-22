const express = require('express') ;
const router = express.Router();
const { createUser, signIn, updateUser } = require('../controllers/usersController');
const basicAuth = require('../middlewares/verifyBasicAuth');
const {apiCount} = require('../middlewares/log');

// users Routes

router.post('/signup', apiCount('userSignup'),createUser);
router.get('/signin', apiCount('userSignin'), basicAuth, signIn);
router.put('/update', apiCount('userUpdate'),basicAuth, updateUser);

module.exports = router;
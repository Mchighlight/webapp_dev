const express = require('express') ;
const router = express.Router();
const { createUser, signIn, updateUser } = require('../controllers/usersController');
const basicAuth = require('../middlewares/verifyBasicAuth');

// users Routes

router.post('/signup', createUser);
router.get('/signin', basicAuth, signIn);
router.put('/update', basicAuth, updateUser);

module.exports = router;
const express = require('express') ;
const router = express.Router();
const { createfileByBookId, deleteFileById } = require('../controllers/filesController');
const basicAuth = require('../middlewares/verifyBasicAuth');
const {apiCount} = require('../middlewares/log');
// Files Route
// private
router.post('/:book_id/image', apiCount('createBookImage'), basicAuth, createfileByBookId);
router.delete('/:book_id/image/:image_id', apiCount('deleteBookImage'), basicAuth, deleteFileById);


module.exports = router;
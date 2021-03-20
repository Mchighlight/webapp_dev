const express = require('express') ;
const router = express.Router();
const { createfileByBookId, deleteFileById } = require('../controllers/filesController');
const basicAuth = require('../middlewares/verifyBasicAuth');

// Files Route
// private
router.post('/:book_id/image', basicAuth, createfileByBookId);
router.delete('/:book_id/image/:image_id', basicAuth, deleteFileById);


module.exports = router;
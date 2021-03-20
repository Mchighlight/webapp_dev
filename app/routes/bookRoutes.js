const express = require('express') ;
const router = express.Router();
const { createBook, getAllBook, getBookById, deleteBookById } = require('../controllers/booksController');
const basicAuth = require('../middlewares/verifyBasicAuth');

// books Routes

// public
router.get('', getAllBook);

// private
router.post('/createBook', basicAuth, createBook);
router.get('/:id', getBookById);
router.delete('/delete/:id', basicAuth, deleteBookById);


module.exports = router;
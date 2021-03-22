const express = require('express') ;
const router = express.Router();
const { createBook, getAllBook, getBookById, deleteBookById } = require('../controllers/booksController');
const basicAuth = require('../middlewares/verifyBasicAuth');
const {apiCount} = require('../middlewares/log');
// books Routes

// public
router.get('', apiCount('getAllBook'), getAllBook);

// private
router.post('/createBook', apiCount('createBook') , basicAuth, createBook);
router.get('/:id', apiCount('getBookById') , getBookById);
router.delete('/delete/:id', apiCount('deleteBookById') , basicAuth, deleteBookById);

module.exports = router;
const { v4: uuidv4 } = require('uuid');
const dbQuery = require('../db/dbQuery');

const {isEmpty} =  require('../helpers/validations');
const {getUserId} = require('../controllers/bookService');
const {
  errorMessage, successMessage, status,
} = require('../helpers/status');

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createBook = async (req, res) => {
  let api_timer = new Date() ;
  const {
    title, author, isbn, published_date,
  } = req.body;

  const book_created = new Date().toISOString();
  
  if (isEmpty(title) || isEmpty(author) || isEmpty(isbn) || isEmpty(published_date)) {
    errorMessage.error = 'Title, author, isbn and published_date field cannot be empty';
    sdc.timing('createBook.timer', api_timer);
    return res.status(status.bad).send(errorMessage);
  }

  // GET USER
  const username = req.user.username;
  console.log(username);
  const user_id = await getUserId({username});
  // VALIDATION 

  const createBookQuery = `INSERT INTO
      books(id, title, author, isbn, published_date, book_created, user_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
  const values = [
    uuidv4(),
    title,
    author,
    isbn,
    published_date,
    book_created,
    user_id
  ];
  
  let query_timer = new Date() ;
  try {
    const { rows } = await dbQuery.query(createBookQuery, values);
    // Logging
    setTimeout(function () {
      sdc.timing('createBookQuery.timer', query_timer);
    }, 100 * Math.random());
    const dbResponse = rows[0];
    delete dbResponse.password;
    successMessage.data = dbResponse;
    setTimeout(function () {
      sdc.timing('createBook.timer', api_timer);
    }, 100 * Math.random());
    return res.status(status.created).send(successMessage);
  } catch (error) {
    // Logging
    setTimeout(function () {
      sdc.timing('createBookQuery.timer', query_timer);
    }, 100 * Math.random());
    setTimeout(function () {
      sdc.timing('createBook.timer', api_timer);
    }, 100 * Math.random());
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User has own this book';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

/**
   * getAllBook
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const getAllBook = async (req, res) => {
  let api_timer = new Date() ;
  const getAllBookQuery = 'SELECT * FROM books';
  let query_timer = new Date() ;
  try {
    const { rows } = await dbQuery.query(getAllBookQuery);
    // Logging
    setTimeout(function () {
      sdc.timing('getAllBookQuery.timer', query_timer);
    }, 100 * Math.random());
    // Logging
    successMessage.data = rows;
    // Logging
    setTimeout(function () {
      sdc.timing('getAllBook.timer', api_timer);
    }, 100 * Math.random());
    // Logging
    return res.status(status.success).send(successMessage);
  } catch (error) {
    // Logging
    setTimeout(function () {
      sdc.timing('getAllBookQuery.timer', query_timer);
    }, 100 * Math.random());
    // Logging
    // Logging
    setTimeout(function () {
      sdc.timing('getAllBook.timer', api_timer);
    }, 100 * Math.random());
    // Logging
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

/**
   * getBookById
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  const getBookById = async (req, res) => {
    let api_timer = new Date() ;
    const getBookByIdQuery = 'SELECT * FROM books WHERE id = $1';
    const bookId = req.params.id;
    let query_timer = new Date() ;
    try {
      const { rows } = await dbQuery.query(getBookByIdQuery, [bookId]);
      // Logging
      setTimeout(function () {
        sdc.timing('getBookByIdQuery.timer', query_timer);
      }, 100 * Math.random());
      // Logging
      const dbResponse = rows[0];
      successMessage.data = dbResponse; 
      // Logging
      setTimeout(function () {
        sdc.timing('getBookById.timer', api_timer);
      }, 100 * Math.random());
      // Logging
      return res.status(status.success).send(successMessage);
    } catch (error) {
      // Logging
      setTimeout(function () {
        sdc.timing('getBookByIdQuery.timer', query_timer);
      }, 100 * Math.random());
      // Logging
      // Logging
      setTimeout(function () {
        sdc.timing('getBookById.timer', api_timer);
      }, 100 * Math.random());
      // Logging
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    }

  };

/**
   * deleteBookById
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  const deleteBookById = async (req, res) => {
    let api_timer = new Date() ;
    const deleteBookByIdQuery = 'DELETE FROM books WHERE id = $1 and user_id=$2';
    const getBookByIdQuery = 'SELECT * FROM books WHERE id = $1 and user_id=$2';
    const bookId = req.params.id;
    // GET USER id
    const username = req.user.username;
    const user_id = await getUserId({username});
    let query_timer = new Date() ;
    try {
      const { rows } = await dbQuery.query(getBookByIdQuery, [bookId, user_id]);
      // Logging
      setTimeout(function () {
        sdc.timing('deleteBookByIdQuery.timer', query_timer);
      }, 100 * Math.random());
      // Logging
      if(rows[0]===undefined){
        sdc.timing('deleteBookById.timer', api_timer);
        return res.status(status.error).send({"error" :"Book is not existed"});
      }   
      await dbQuery.query(deleteBookByIdQuery, [bookId, user_id]);
      // Logging
      setTimeout(function () {
        sdc.timing('deleteBookById.timer', api_timer);
      }, 100 * Math.random());
      // Logging
      return res.status(status.nocontent).send("Book Deleted");
    } catch (error) {
      // Logging
      setTimeout(function () {
        sdc.timing('deleteBookByIdQuery.timer', query_timer);
      }, 100 * Math.random());
      // Logging
      // Logging
      setTimeout(function () {
        sdc.timing('deleteBookById.timer', api_timer);
      }, 100 * Math.random());
      // Logging
      errorMessage.error = 'Operation was not successful';
      console.log(error);
      return res.status(status.error).send(errorMessage);
    }

  };
  

module.exports =  {
  createBook,
  getAllBook,
  getBookById,
  deleteBookById
};
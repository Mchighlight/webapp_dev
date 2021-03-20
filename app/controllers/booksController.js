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
  const {
    title, author, isbn, published_date,
  } = req.body;

  const book_created = new Date().toISOString();
  
  if (isEmpty(title) || isEmpty(author) || isEmpty(isbn) || isEmpty(published_date)) {
    errorMessage.error = 'Title, author, isbn and published_date field cannot be empty';
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
  
  try {
    const { rows } = await dbQuery.query(createBookQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
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
  const getAllBookQuery = 'SELECT * FROM books';
  try {
    const { rows } = await dbQuery.query(getAllBookQuery);
    //const dbResponse = rows[0];
    successMessage.data = rows;
    return res.status(status.success).send(successMessage);
  } catch (error) {
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
    const getBookByIdQuery = 'SELECT * FROM books WHERE id = $1';
    const bookId = req.params.id;
    // GET USER id
    // const username = req.user.username;
    // const user_id = await getUserId({username});
    try {
      const { rows } = await dbQuery.query(getBookByIdQuery, [bookId]);
      const dbResponse = rows[0];
      successMessage.data = dbResponse;
      console.log(rows);
      return res.status(status.success).send(successMessage);
    } catch (error) {
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
    const deleteBookByIdQuery = 'DELETE FROM books WHERE id = $1 and user_id=$2';
    const getBookByIdQuery = 'SELECT * FROM books WHERE id = $1 and user_id=$2';
    const bookId = req.params.id;
    // GET USER id
    const username = req.user.username;
    const user_id = await getUserId({username});
    try {
      const { rows } = await dbQuery.query(getBookByIdQuery, [bookId, user_id]);
      console.log(rows[0]);
      if(rows[0]===undefined){
        return res.status(status.error).send({"error" :"Book is not existed"});
      }   
      await dbQuery.query(deleteBookByIdQuery, [bookId, user_id]);
      return res.status(status.nocontent).send("Book Deleted");
    } catch (error) {
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
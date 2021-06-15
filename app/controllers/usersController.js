const { v4: uuidv4 } = require('uuid');
const dbQuery = require('../db/dbQuery');

const {
  hashPassword,
  isValidEmail,
  validatePassword,
  isEmpty,
} =  require('../helpers/validations');

const {
  errorMessage, successMessage, status,
} = require('../helpers/status');

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createUser = async (req, res) => {
  let api_timer = new Date() ;
  const {
    email, first_name, last_name, password,
  } = req.body;

  const created_on = new Date().toISOString();
  const updated_on  = new Date().toISOString();
  
  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
    errorMessage.error = 'Email, password, first name and last name field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than eight(8) characters';
    return res.status(status.bad).send(errorMessage);
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(id, email, first_name, last_name, password, account_created, account_updated )
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
  const values = [
    uuidv4(),
    email,
    first_name,
    last_name,
    hashedPassword,
    created_on,
    updated_on
  ];

  let query_timer = new Date() ;
  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

/**
   * getUser
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const signIn = async (req, res) => {
  let api_timer = new Date() ;
  const email = req.user['username'];
  const signinUserQuery = 'SELECT * FROM users WHERE email = $1';

  let query_timer = new Date() ;
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

// TODO: Update
/**
 * Update A User to Admin
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated user
 */
const updateUser = async (req, res) => {
    let api_timer = new Date() ;
    const email = req.user['username'];
    const { first_name, last_name, password} = req.body;

    const updateUser= `UPDATE users
        SET first_name=$1, last_name=$2, password=$3, account_updated=$4 
        WHERE email=$5  returning *`;

    let query_timer = new Date() ;
    try {
      // Check update field
      if ( password && !validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Password';
        return res.status(status.bad).send(errorMessage);
      }

      const hashedPassword = hashPassword(password);
      const updated_on  = new Date().toISOString();
      const values = [
        first_name,
        last_name,
        hashedPassword,
        updated_on,
        email,
      ];
      
      const response = await dbQuery.query(updateUser, values);

      const dbResult = response.rows[0];
      delete dbResult.password;
      successMessage.data = dbResult;

      return res.status(status.success).send(successMessage);
    } catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    }
  };


module.exports =  {
  createUser,
  signIn,
  updateUser,
};
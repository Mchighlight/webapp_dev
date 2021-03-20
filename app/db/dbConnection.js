//db/dev/dbConnection.js

const pool = require('./pool');

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create User Table
 * CREATE TABLE test
  (id SERIAL PRIMARY KEY, 
  name VARCHAR(100) UNIQUE NOT NULL, 
  phone VARCHAR(100));
 */
const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id VARCHAR(100) PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  first_name VARCHAR(100), 
  last_name VARCHAR(100), 
  password VARCHAR(100) NOT NULL,
  account_created VARCHAR(100) NOT NULL,
  account_updated VARCHAR(100) NOT NULL)`;

  pool.query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Book Table
 * CREATE TABLE test
  (id SERIAL PRIMARY KEY, 
  name VARCHAR(100) UNIQUE NOT NULL, 
  phone VARCHAR(100));
 */
const createBookTable = () => {
  const bookCreateQuery = `CREATE TABLE IF NOT EXISTS books
  (id VARCHAR(100) PRIMARY KEY, 
  title VARCHAR(100) , 
  author VARCHAR(100), 
  isbn VARCHAR(100) UNIQUE NOT NULL, 
  published_date VARCHAR(100) NOT NULL,
  book_created VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL)`;

  pool.query(bookCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createFileTable = () => {
  const filesCreateQuery = `CREATE TABLE IF NOT EXISTS files
  (file_id VARCHAR(100) UNIQUE PRIMARY KEY,
  s3_object_name VARCHAR(100) NOT NULL, 
  file_name VARCHAR(100) NOT NULL, 
  created_date VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  book_id VARCHAR(100) NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`;

  pool.query(filesCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users';
  pool.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


const dropBookTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS books';
  pool.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropFileTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS files';
  pool.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Delete User Table
 */
const deleteUserTable = () => {
  const usersDeleteQuery = 'DELETE FROM users';
  pool.query(usersDeleteQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Delete Book Table
 */
const deleteBookTable = () => {
  const usersDeleteQuery = 'DELETE FROM books';
  pool.query(usersDeleteQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Delete Files Table
 */
const deleteFileTable = () => {
  const usersDeleteQuery = 'DELETE FROM files';
  pool.query(usersDeleteQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createBookTable();
  createFileTable();
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropBookTable();
  dropFileTable();
};

/**
 * Delete All Tables
 */
const deleteAllTables = () => {
  deleteUserTable();
  deleteBookTable();
  deleteFileTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

if(process.env.npm_config_action==="create"){
  createAllTables();}
else if(process.env.npm_config_action==="drop"){
  dropAllTables();}
else if(process.env.npm_config_action==="empty"){
  deleteAllTables();}
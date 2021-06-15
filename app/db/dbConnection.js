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



const createAllTables = () => {
  createUserTable();
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
};

/**
 * Delete All Tables
 */
const deleteAllTables = () => {
  deleteUserTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

// if(process.env.npm_config_action==="create"){
//   createAllTables();}
// else if(process.env.npm_config_action==="drop"){
//   dropAllTables();}
// else if(process.env.npm_config_action==="empty"){
//   deleteAllTables();}

createUserTable();
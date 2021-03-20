# Restful API Web Application Development
a web application using technology stack that meets Cloud Native Web Application Requirements. Start implementing APIs for the web application. Features of the web application will be split among various applications.  implement RESTful APIs based on user stories 

## Table of Contents (Optional)

- [Usage](#usage)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Settings](#settings)
- [License](#license)


## Usage


## Features
   Add to Base URL above

- Use the following Endpoints

    `POST /api/v1/signup` Create User Account

    `GET /api/v1/signin` Get a your account need basic auth

    `PUT /api/v1/update` Update User info



- A successful response will be

     ```javascript
      { status: 'success', data: {} }
     ```
     or

     ```javascript
      { status: 'success', data: [] }
     ```

  and an unsuccessful response will be

     ```javascript
     { status: 'error', error: '​relevant-error-message' }
     ```

## Prerequisites
- NodeJs and Npm (https://nodejs.org/en/download/)

- PostgreSQL(https://www.postgresql.org/download/)

- In `config` folder create `dev.js` file so you have `config/dev.js` 
- In `config` folder create `test.js` file so you have `config/test.js` 
- Create two database, one for Development another one for testing

## Settings
   Add postgresql development database url and port to  `config/dev.js`
   ```javascript
    module.exports = {
        DATABASE_URL:  'postgres://{db_username}:{db_password}@{host}:{port}/{db_name}'
        DATABASE_PORT: '{port}'
    }
   ```

  Add postgresql test database url and port to  `config/test.js`
  ```javascript
    module.exports = {
        DATABASE_URL:  'postgres://{db_username}:{db_password}@{host}:{port}/{db_name}'
        DATABASE_PORT: '{port}'
    }
   ```

   Install all of the dependencies
   ```shell
   $ npm install
   ```
   Install all of the dev dependencies
   ```shell
   $ npm install nodemon chai chai-http mocha npm-pack-zip --save-dev
   ```

   After Setting up the database, create database tables running the command below, its advisable to run the command more than once and make sure your database is updated with the tables:

   ```shell
   $ npm run table --action=create
   ```
   Start server by running:

   ```shell
   $ npm run dev
   ```
   Test endpoints by running:
   ```shell
   $ npm run test
   ```
## License
   None for now.

  developed with 💕 by Hung-Chih Huang NUID:001005756

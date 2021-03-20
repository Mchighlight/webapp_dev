
const pg = require('pg');
const config = require('../config');

const databaseConfig = { connectionString: config.DATABASE_URL };
const pool = new pg.Pool(databaseConfig);

module.exports = pool;
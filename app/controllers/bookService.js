
const dbQuery = require('../db/dbQuery');



const getUserId = async (user)=> {
    const getUserIdQuery = 'SELECT id FROM users WHERE email = $1';
    try {
        const username = user['username'] ;
        const { rows } = await dbQuery.query(getUserIdQuery, [username]);
        const dbResponse = rows[0];
        return dbResponse.id ;
      } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
      }
}


module.exports = {
    getUserId
};

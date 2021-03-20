
const dbQuery = require('../db/dbQuery');
const { errorMessage } = require('../helpers/status');
const {
    comparePassword,
} =  require('../helpers/validations');


const authenticate = async (user)=> {
    const signinUserQuery = 'SELECT password FROM users WHERE email = $1';
    try {
        const username = user['username'] ;
        const { rows } = await dbQuery.query(signinUserQuery, [username]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'No user with such names';
            console.log('No user with such names')
        }
        return comparePassword(dbResponse.password, user['password']);
      } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
      }
}
module.exports = {
    authenticate
};
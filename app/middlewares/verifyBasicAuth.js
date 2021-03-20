const userService = require('../controllers/userService');
const { errorMessage, status } = require('../helpers/status');

const basicAuth = async (req, res, next) => {
    // make authenticate path public

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = await userService.authenticate({ username, password });
    if (!user) {
        errorMessage.error = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorMessage);
    }

    // attach user to request object
    req.user = { username, password }
    next();
}

module.exports = basicAuth;
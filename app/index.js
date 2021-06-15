const express = require('express') ;
const bodyParser = require('body-parser');
const usersRoute = require('./routes/userRoutes');
const server = express();


global.__basedir = __dirname;

async function runServer() {
    // Add middleware for parsing URL encoded bodies (which are usually sent by browser)
    server.use(bodyParser.json());
    // Add middleware for parsing JSON and urlencoded data and populating `req.body`

    
    server.use('/user/self', usersRoute);
    
    server.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));
    
    const PORT = parseInt(process.env.PORT, 10) || 3001;
    server.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log('Server ready on port:', PORT);
    })
}

module.exports = runServer() ;
//runServer();
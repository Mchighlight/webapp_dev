
require("./userTest.js")
const pool = require('../db/pool');

pool.on('connect', () => {
  console.log('connected to the db');
});

const deleteBookTable = () => {
    const usersDeleteQuery = 'DELETE FROM books';
    pool.query(usersDeleteQuery)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


const expect = chai.expect;
chai.use(chaiHttp);
describe('Users', () => {
    
    // afterEach((done) => { //Before each test we empty the database
    //     deleteUserTable();
    // });
    
    var url = 'http://localhost:3001';
    var requester = chai.request.agent(url);
    var bookId='123'


    describe('/POST creatBook', () => {
        it('it should Post book is not authentication  return 401', (done) => {
            const book = {
                title: "Fish 101",
                author: "Henry Huang",
                isbn: "973-1-56581-231-1 52242",
                published_date: "May, 2020"
            }
        requester
            .post('/books/createBook/')
            .send(book)
            .end((err, res) => {
                    //console.log(res.status);
                    expect(res).to.have.status(401);
                done();
            });
        });
    });

    describe('/POST creatBook', () => {
        it('it should Post book without ISBN should return 400', (done) => {
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            
            const book = {
                title: "Fish 101",
                author: "Henry Huang",
                published_date: "May, 2020"
            }
        requester
            .post('/books/createBook/')
            .send(book)
            .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
            .end((err, res) => {
                    //console.log(res.status);
                    expect(res).to.have.status(400);
                done();
            });
        });
    });


    describe('/POST creatBook', () => {
        it('it should Post book is with authentication return 201', (done) => {
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            deleteBookTable();
            const book = {
                title: "Fish 101",
                author: "Henry Huang",
                isbn: "973-1-56581-231-1 52240",
                published_date: "May, 2020"
            }
        requester
            .post('/books/createBook/')
            .send(book)
            .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
            .end((err, res) => {
                    //console.log(res.status);
                    expect(res).to.have.status(201);
                done();
            });
        });
    });

    describe('/POST creatBook', () => {
        it('it should Post book return error because duplicate creating with same isbn return 409', (done) => {
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            
            const book = {
                title: "Fish 101",
                author: "Henry Huang",
                isbn: "973-1-56581-231-1 52240",
                published_date: "May, 2020"
            }
        requester
            .post('/books/createBook/')
            .send(book)
            .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
            .end((err, res) => {
                    //console.log(res.status);
                    expect(res).to.have.status(409);
                done();
            });
        });
    });

    describe('/GET all books', () => {
        it('should GET book without authentication will return 200', function (done) { // <= Pass in done callback
    
            requester
                .get('/books/'+bookId)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/GET all books', () => {
        it('should GET book without authentication will return 200', function (done) { // <= Pass in done callback
    
            requester
                .get('/books/:id')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/DELETE Book', () => {
        it('it should Delete book is not authentication  return 401', (done) => {
            const bookId = "76631d69-00bb-4438-b69f-d7d0ed1edf2a" ;
        requester
            .delete('/books/delete/' + bookId)
            .end((err, res) => {
                    //console.log(res.status);
                    expect(res).to.have.status(401);
                done();
            });
        });
    });

});
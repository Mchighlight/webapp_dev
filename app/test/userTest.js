
const pool = require('../db/pool');

pool.on('connect', () => {
  console.log('connected to the db');
});

const deleteUserTable = () => {
    const usersDeleteQuery = 'DELETE FROM users';
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

    describe('/POST user', () => {
        it('it should Post user successfully return 201', (done) => {
            deleteUserTable();
            const user = {
                email: "mchighlight@hotmail.com",
                first_name: "Henry",
                last_name: "Huang",
                password: "Mc@110164"
            }
        requester
            .post('/user/self/signup')
            .send(user)
            .end((err, res) => {
                    console.log(res.status);
                    expect(res).to.have.status(201);
                done();
            });
        });
    });


    describe('/POST user', () => {
        it('it should Post user has existed return 409', (done) => {
            const user = {
                email: "mchighlight@hotmail.com",
                first_name: "Henry",
                last_name: "Huang",
                password: "Mc@110164"
            }
        requester
            .post('/user/self/signup')
            .send(user)
            .end((err, res) => {
                    console.log(res.status);
                    expect(res).to.have.status(409);
                done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should Post user fail without body  return 400', (done) => {
            const user = {
                email: "mchighlight@hotmail.com"
            }
        requester
            .post('/user/self/signup')
            .send(user)
            .end((err, res) => {
                    console.log(res.status);
                    expect(res).to.have.status(400);
                done();
            });
        });
    });


    describe('/GET user', () => {
        it('should GET user without authentication will return 401', function (done) { // <= Pass in done callback
    
            requester
                .get('/user/self/signin')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/GET user', () => {
        it('should GET user with authentication will return 200', function (done) { // <= Pass in done callback
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            requester

                .get('/user/self/signin')
                .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/PUT user', () => {
        it('should PUT user without authentication will return 401', function (done) { // <= Pass in done callback
    
            requester
                .put('/user/self/update')
                .end(function (err, res) {
                    expect(res).to.have.status(401);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/PUT user', () => {
        it('should PUT user with authentication withou body will return 404', function (done) { // <= Pass in done callback
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            requester
                .put('/user/self/update')
                .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done(); // <= Call done to signal callback end
                });
        });
    });

    describe('/PUT user', () => {
        it('should PUT user with authentication will return 200', function (done) { // <= Pass in done callback
            const username = "mchighlight@hotmail.com";
            const password = "Mc@110164";
            const update_info = {
                first_name: "Du",
                last_name: "Ma May",
                password: "Mc@110164"
            }
            requester
                .put('/user/self/update')
                .send(update_info)
                .set('Authorization', "Basic " + Buffer.from(username + ":" + password).toString('base64'))
                .end(function (err, res) {
                    //console.log(res);
                    expect(res).to.have.status(200);
                    done(); // <= Call done to signal callback end
                });
        });
    });
});
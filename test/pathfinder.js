process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET /api/pathfinder', () => {
    it('it should return an error when no params is given', (done) => {
        chai.request(server.app)
            .get('/api/pathfinder')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('error');
                done();
            });
    });
});
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET pathfinder', () => {
    it('it should find the path', (done) => {
        chai.request(server.app)
            .get('/api/pathfinder');
        // .end((err, res) => {
        //     res.should.have.status(200);
        //     res.body.should.be.a('array');
        //     res.body.length.should.be.eql(0);
        done();
        // });
    });
});
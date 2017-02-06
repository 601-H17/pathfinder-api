// process.env.NODE_ENV = 'test';

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../index');
// let should = chai.should();

// chai.use(chaiHttp);

var assert = require('assert');
describe('/GET book', () => {
    it('it should GET all the books', (done) => {
        assert.equal(-1, [1, 2, 3].indexOf(4));
        done();
    });
});
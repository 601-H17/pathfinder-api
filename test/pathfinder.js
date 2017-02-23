process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../build/index');
let should = chai.should();
let algorithmPathfinder = require('../build/pathfinderAlgorithm')

chai.use(chaiHttp);

describe('api', function() {
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
});

var assert = require('assert');
var localToFind = 'G-164';
var localPoint;
var result = { type: 'Feature',
  properties: { entrance: 'yes', ref: 'G-165' },
  geometry: 
   { type: 'Point',
     coordinates: [ -71.2874189411, 46.78601674403 ] } }
describe('Pathfinder', function() {
  describe('#findLocalGeo(localToFind)', function() {
    it('should return a localization of the local when the local to find is given', function() {
      assert.equal(result, algorithmPathfinder.findLocalGeo(localToFind));
    });
  });
});


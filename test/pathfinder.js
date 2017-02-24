process.env.NODE_ENV = 'test';
import 'babel-polyfill'; 

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../build/index');
let should = chai.should();
let algorithmPathfinder = require('../build/pathfinderAlgorithm')

chai.use(chaiHttp);

/*
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
});*/

var assert = require('assert');
var startLocal = 'G-165';
var endLocal = 'G-164';
var localPoint;
var result = { path: 
   [ [ -71.2874189411, 46.78601674403 ],
     [ -71.28741905245, 46.78600546398 ],
     [ -71.28729974824, 46.78601907973 ],
     [ -71.28730301717, 46.78602796227 ] ],
  weight: 0.011485373846850676 };
var local = { type: 'Feature',
  properties: { entrance: 'yes', ref: 'G-165' },
  geometry: 
   { type: 'Point',
     coordinates: [ -71.2874189411, 46.78601674403 ] } };
describe('Pathfinder', function() {
  describe('#pathfind(startLocal, endLocal)', function() {
    it('should return a localization of the local when the local to find is given', async function(done) {
      var path = await algorithmPathfinder.pathfind(startLocal, endLocal);
      assert.equal(result, path);
      done();
    });
  });
});


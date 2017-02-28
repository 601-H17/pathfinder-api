process.env.NODE_ENV = 'test';
import 'babel-polyfill'; 

let chai = require('chai');
let expect = require('chai').expect;
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

var startLocal = 'G-165';
var endLocal = 'G-164';
var localPoint;

var result = { path: 
                [ [ -71.2874189411, 46.78601674403 ],
                  [ -71.28741905245, 46.78600546398 ],
                  [ -71.28729974824, 46.78601907973 ],
                  [ -71.28730301717, 46.78602796227 ] ],
              weight: 0.011485373846850676 };

describe('Pathfinder', function() {
    describe('#pathfind(startLocal, endLocal)', function() {
        it('should return a localization of the local when the local to find is given', async () => {
        var path = await algorithmPathfinder.pathfind(startLocal, endLocal);
        expect(path.path).to.eql(result.path);
        expect(path.weight).to.eql(result.weight);
        });
    });
    
    describe('#pathfind(startLocal, endLocal) with higher floor and same wing', function() {
        it('should return a localization of the local when the local was find', async () => {
            const RESULT_LENGTH = 2;

            var fullpath = await algorithmPathfinder.pathfind(startLocal, endLocal);
            
            expect(fullpath.path).to.eql(resultTestHigherFloor.path);
            expect(fullpath.weight).to.eql(resultTestHigherFloor.weight);
            expect(fullpath).to.have.lengthOf(RESULT_LENGTH)
        });
    });
    
});


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


describe('Pathfinder of locals on same floor and wing', function() {
    var startLocal = 'G-165';
    var endLocal = 'G-164';
    const FIRST_FLOOR_LOCAL = 'G-165';
    const SAME_FLOOR_LOCAL = 'G-164';
    const EXPECTED_PATHFIND_RESULT = [{ path: 
                                            [ [ -71.2874189411, 46.78601674403 ],
                                            [ -71.28741905245, 46.78600546398 ],
                                            [ -71.28729974824, 46.78601907973 ],
                                            [ -71.28730301717, 46.78602796227 ] ],
                                    weight: 0.011485373846850676, floorPath:1 },
                                    { totalWeight: 0.011485373846850676 }];
    var localPoint;
    describe('#pathfind(startLocal, endLocal)', function() {
        context('when the local to find is given', function(){
            it('should return the path to the local', async () => {

                //Arrange
                const PATH_PROPERTY = 'path';
                const WEIGHT_PROPERTY = 'weight';
                const FLOOR_PROPERTY = 'floorPath';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SAME_FLOOR_LOCAL);

                //Assert
                expect(fullpath[0]).to.have.ownProperty(PATH_PROPERTY);
                expect(fullpath[0].path).to.eql(EXPECTED_PATHFIND_RESULT[0].path);
                expect(fullpath[0]).to.have.ownProperty(WEIGHT_PROPERTY);
                expect(fullpath[0].weight).to.eql(EXPECTED_PATHFIND_RESULT[0].weight);
                expect(fullpath[0]).to.have.ownProperty(FLOOR_PROPERTY);
                expect(fullpath[0].floorPath).to.eql(EXPECTED_PATHFIND_RESULT[0].floorPath);
            });
        });
    });
    
    describe('#pathfind(startLocal, endLocal)', function() {
        context('when the local was found', function(){
            it('should return the total weight distance of the path', async () => {

                //Arrange
                const RESULT_LENGTH = 2;
                const TOTAL_WEIGHT_PROPERTY = 'totalWeight';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SAME_FLOOR_LOCAL);
      
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                expect(fullpath[1]).to.have.ownProperty(TOTAL_WEIGHT_PROPERTY);
                expect(fullpath[1].totalWeight).to.eql(EXPECTED_PATHFIND_RESULT[1].totalWeight);
            });
        });
    });
    
});
/*
describe('Pathfinder of locals on different floor but same wing', function(){
    describe('#pathfind(startLocal, endLocal)', function(){
        context('when the local was found', function(){
            it('should return a path to the local through staircases', async () => {
                //Arrange
                const RESULT_LENGTH = 3;
                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
            });
        });
    });
});
*/

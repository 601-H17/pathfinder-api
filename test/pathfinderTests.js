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
    const FIRST_FLOOR_LOCAL = 'G-165';
    const SAME_FLOOR_LOCAL = 'G-164';
    const RESULT_LENGTH = 2;
    const EXPECTED_PATHFIND_RESULT = [{ path: 
                                        [ [ -71.2874189411, 46.78601674403 ],
                                        [ -71.28741905245, 46.78600546398 ],
                                        [ -71.28729974824, 46.78601907973 ],
                                        [ -71.28730301717, 46.78602796227 ] ],
                                   weight: 0.011485373846850676, floorPath:1 },
                                   { totalWeight: 0.011485373846850676 }];

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
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
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
describe('Pathfinder of locals on one floor and same wing', function(){
    const FIRST_FLOOR_LOCAL = 'G-165';
    const SECOND_FLOOR_LOCAL = 'G-273';
    const RESULT_LENGTH = 3;
    // mock
    //const EXPECTED_PATHFIND_RESULT;

    describe('#pathfind(startLocal, endLocal)', function(){
        context('when the local to find is given', function(){
            it('should return a path to the local through staircases', async () => {

                //Arrange
                const PATH_PROPERTY = 'path';
                const FLOOR_PROPERTY = 'floorPath';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);
                
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                for(var i = 0; i <= fullpath.length -1; i++){
                    expect(fullpath[i]).to.have.ownProperty(PATH_PROPERTY);
                    expect(fullpath[i].path).to.eql(EXPECTED_PATHFIND_RESULT[i].path);
                    expect(fullpath[i]).to.have.ownProperty(FLOOR_PROPERTY);
                    expect(fullpath[i].floorPath).to.eql(EXPECTED_PATHFIND_RESULT[i].floorPath);
                }
            });
        });
    });

    describe('#pathfind(startLocal, endLocal)', function() {
        context('when the local was found', function(){
            it('should return the total weight distance of the path', async () => {

                //Arrange
                const TOTAL_WEIGHT_PROPERTY = 'totalWeight';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);
      
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                expect(fullpath[1]).to.have.ownProperty(TOTAL_WEIGHT_PROPERTY);
                expect(fullpath[1].totalWeight).to.eql(EXPECTED_PATHFIND_RESULT[1].totalWeight);
            });
        });
    });
});
*/

describe('Pathfinder of locals on local that doesnt exist', function(){
    const FIRST_FLOOR_LOCAL = 'G-100';
    const SAME_FLOOR_LOCAL = 'G-102';

    describe('#pathfind(startLocal, endLocal)', function(){
        context('when the local to find is given', function(){
            it('should fail', async () => {
                try {
                    new ErrorThrowingObject();
                    // Force the test to fail since error wasn't thrown
                    should.fail('no error was thrown when it should have been')
                }
                catch (error) {
                    // Constructor threw Error, so test succeeded.
                }
            });
        });
    });
}); 

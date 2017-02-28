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



describe('Pathfinder of locals on same floor and wing', function() {
    beforeEach(function(){
        const FIRST_FLOOR_LOCAL = 'G-165';
        const SAME_FLOOR_LOCAL = 'G-164';
        const EXPECTED_PATHFIND_RESULT = { path: 
                                                [ [ -71.2874189411, 46.78601674403 ],
                                                [ -71.28741905245, 46.78600546398 ],
                                                [ -71.28729974824, 46.78601907973 ],
                                                [ -71.28730301717, 46.78602796227 ] ],
                                            weight: 0.011485373846850676 };
    });

    describe('#pathfind(startLocal, endLocal)', function() {
        context('when the local to find is given', function(){
            it('should return the path to the local', async () => {

                //Arrange
                const PATH_PROPERTY = 'path';
                const WEIGHT_PROPERTY = 'weight';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SAME_FLOOR_LOCAL);

                //Assert
                expect(fullpath).to.have.property(PATH_PROPERTY , result.path);
                expect(fullpath).to.have,property(WEIGHT_PROPERTY , result.weight);
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
                expect(fullpath).to.have.property(TOTAL_WEIGHT_PROPERTY, EXPECTED_PATHFIND_RESULT.weight);
            });
        });
    });
    
});
/*
describe('Pathfinder of locals on different floor but same wing', function(){
    before(function(){
        const FIRST_FLOOR_LOCAL = 'G-165';
        const SECOND_FLOOR_LOCAL = 'G-273';
        //RESULT
    });

    describe('#pathfind(startLocal, endLocal)', function(){
        context('when the local was found', function(){
            it('should return a path to the local through staircases', async () => {
                //Arrange
                const RESULT_LENGTH = 3;
                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                expect(fullpath).to.have
            });
        });
    });
});
*/

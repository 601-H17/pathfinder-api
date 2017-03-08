process.env.NODE_ENV = 'test';
import 'babel-polyfill';

let fs = require("fs");
let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

var algorithmPathfinder = require('../src/pathfinderAlgorithm')

var nock = require('nock');
var request = require('supertest')("http://api.postcodes.io");

let csfUrl = 'https://csf-geo-app.herokuapp.com';
let authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';

const API_PATHS = {
    classrooms: '/api/classrooms',
    staircases: '/api/stairs',
    staircase: '/api/stair/',
    classroom: '/api/classroom/'
}

const JSON_FILE_PATH = {
    classrooms: './test/mock/classrooms.json',
    staircases: './test/mock/stairs.json'
}

describe('Pathfinder of locals on same floor and wing', async () => {
    const FIRST_FLOOR_LOCAL = 'G-159';
    const SAME_FLOOR_LOCAL = 'G-164';
    const RESULT_LENGTH = 2;
    const EXPECTED_PATHFIND_RESULT = [{
        "path": [[-71.28744880705, 46.78616405305], [-71.28744862094, 46.78617692099], [-71.2873343784, 46.78618628093], [-71.28722013587, 46.78619564086], [-71.28717434574, 46.78619939247], [-71.28714127334, 46.78603716589], [-71.28718697248, 46.78603195041], [-71.28729974824, 46.78601907973], [-71.28730301717, 46.78602796227]],
        "weight": 0.053944138739687515,
        "floorPath": 1
    }, { "totalWeight": 0.053944138739687515 }]

    verifyJsonContentWithApi(API_PATHS.staircases, JSON_FILE_PATH.staircases);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, FIRST_FLOOR_LOCAL);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, SAME_FLOOR_LOCAL);

    describe('#pathfind(G-159, G-164)', function () {
        context('when the locals to find are given', function () {
            it('should return the path to the local', async () => {
                //Arrange
                const PATH_PROPERTY = 'path';
                const WEIGHT_PROPERTY = 'weight';
                const FLOOR_PROPERTY = 'floorPath';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SAME_FLOOR_LOCAL);
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                for (var i = 0; i < fullpath.length - 1; i++) {
                    expect(fullpath[i]).to.have.ownProperty(PATH_PROPERTY);
                    expect(fullpath[i].path).to.eql(EXPECTED_PATHFIND_RESULT[i].path);
                    expect(fullpath[i]).to.have.ownProperty(FLOOR_PROPERTY);
                    expect(fullpath[i].floorPath).to.eql(EXPECTED_PATHFIND_RESULT[i].floorPath);
                }
            });
        });
    });

    describe('#pathfind(G-159, G-164)', function () {
        context('when the path was found', function () {
            it('should return the total weight distance of the path', async () => {
                //Arrange
                const TOTAL_WEIGHT_PROPERTY = 'totalWeight';
                const PATH_INDEX = 1;

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SAME_FLOOR_LOCAL);

                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                expect(fullpath[PATH_INDEX]).to.have.ownProperty(TOTAL_WEIGHT_PROPERTY);
                expect(fullpath[PATH_INDEX].totalWeight).to.eql(EXPECTED_PATHFIND_RESULT[PATH_INDEX].totalWeight);
            });
        });
    });
});


describe('Pathfinder of locals on two different floors and same wing', function () {
    const FIRST_FLOOR_LOCAL = 'G-159';
    const SECOND_FLOOR_LOCAL = 'G-259';
    const FIRST_STAIRCASE = 'GE-04';
    const SECOND_STAIRCASE = 'GE-01';
    const THIRD_STAIRCASE = 'GE-02';
    const FOURTH_STAIRCASE = 'GE-03';
    const RESULT_LENGTH = 3;

    const EXPECTED_PATHFIND_RESULT = [{ "path": [[-71.28744880705, 46.78616405305], [-71.28744862094, 46.78617692099], [-71.28756283019, 46.78616756378], [-71.28759588902, 46.78616485525], [-71.28761727415, 46.78616310316], [-71.2876974678, 46.7861554083]], "weight": 0.02053525689345632, "floorPath": 1 }, 
    {  "path": [[-71.28770174226, 46.78617886766], [-71.28768934462, 46.78617991913], [-71.28759516197, 46.78618790696], [-71.28754869317, 46.78619184808], [-71.28746829755, 46.78619866661], [-71.28742809974, 46.78620207587], [-71.28734118171, 46.78620944758], [-71.28733888829, 46.7861961435]], "weight": 0.02916080328538606, "floorPath": 2 }, 
    { "totalWeight": 0.049696060178842386 }]


    verifyJsonContentWithApi(API_PATHS.staircases, JSON_FILE_PATH.staircases);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, FIRST_FLOOR_LOCAL);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, SECOND_FLOOR_LOCAL);

    verifyJsonContentWithApi(API_PATHS.staircase, JSON_FILE_PATH.staircases, FIRST_STAIRCASE);
    verifyJsonContentWithApi(API_PATHS.staircase, JSON_FILE_PATH.staircases, SECOND_STAIRCASE);
    verifyJsonContentWithApi(API_PATHS.staircase, JSON_FILE_PATH.staircases, THIRD_STAIRCASE);
    verifyJsonContentWithApi(API_PATHS.staircase, JSON_FILE_PATH.staircases, FOURTH_STAIRCASE);


    describe('#pathfind(G-159, G-259)', function () {
        context('when the locals to find are given', function () {
            it('should return a path to the local through staircases', async () => {
                //Arrange
                const PATH_PROPERTY = 'path';
                const FLOOR_PROPERTY = 'floorPath';

                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);
                console.log(JSON.stringify(fullpath));
                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                for (var i = 0; i < fullpath.length - 1; i++) {
                    expect(fullpath[i]).to.have.ownProperty(PATH_PROPERTY);
                    expect(fullpath[i].path).to.eql(EXPECTED_PATHFIND_RESULT[i].path);
                    expect(fullpath[i]).to.have.ownProperty(FLOOR_PROPERTY);
                    expect(fullpath[i].floorPath).to.eql(EXPECTED_PATHFIND_RESULT[i].floorPath);
                }
            });
        });
    });

    describe('#pathfind(G-159, G-259)', function () {
        context('when the path was found', function () {
            it('should return the total weight distance of the path', async () => {
                //Arrange
                const TOTAL_WEIGHT_PROPERTY = 'totalWeight';
                const PATH_INDEX = 2;
                //Act
                var fullpath = await algorithmPathfinder.pathfind(FIRST_FLOOR_LOCAL, SECOND_FLOOR_LOCAL);

                //Assert
                expect(fullpath).to.have.lengthOf(RESULT_LENGTH);
                expect(fullpath[PATH_INDEX]).to.have.ownProperty(TOTAL_WEIGHT_PROPERTY);
                expect(fullpath[PATH_INDEX].totalWeight).to.eql(EXPECTED_PATHFIND_RESULT[PATH_INDEX].totalWeight);
            });
        });
    });
});


describe('Pathfinder on local that doesnt exist', function () {
    const NON_EXISTING_LOCAL = 'G-100';
    const EXISTING_LOCAL = 'G-160';

    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, NON_EXISTING_LOCAL);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, EXISTING_LOCAL);

    describe('#pathfind(G-100, G-160)', function () {
        context('when the local to find does not exist', function () {
            it('should throw an exception', async () => {
                expect(async () => algorithmPathfinder.pathfind(NON_EXISTING_LOCAL, EXISTING_LOCAL).to.throw(algorithmPathfinder.ERROR_MESSAGES.localNotFound));
            });
        });
    });
});

describe('Pathfinder of locals on same floor but different wings', function () {
    const G_WING_LOCAL = 'G-158';
    const A_WING_LOCAL = 'A-227';

    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, G_WING_LOCAL);
    verifyJsonContentWithApi(API_PATHS.classroom, JSON_FILE_PATH.classrooms, A_WING_LOCAL);

    describe('#pathfind(G-158, A-227)', function () {
        context('when the locals to find are given', function () {
            it('should throw an exception, because the feature is not implemented yet', async () => {
                expect(async () => algorithmPathfinder.pathfind(G_WING_LOCAL, A_WING_LOCAL).to.throw(algorithmPathfinder.ERROR_MESSAGES.wingToWingNotImplemented));
            });
        });
    });

});


function verifyJsonContentWithApi(path, jsonFilePath, localName) {
    var contents = fs.readFileSync(jsonFilePath);
    var jsonContent = JSON.parse(contents);

    if (path == API_PATHS.classrooms || path == API_PATHS.staircases) {
        nock(csfUrl, {
            reqheaders: {
                "authorization": 'Token token=' + authToken
            }
        })
            .persist()
            .get(path)
            .reply(200, jsonContent);
    }
    else {
        for (var i = 0; i <= jsonContent.length - 1; i++) {
            if (jsonContent[i].name == localName) {
                var no = nock(csfUrl, {
                    reqheaders: {
                        "authorization": 'Token token=' + authToken
                    }
                })
                    .persist()
                    .get(path + localName)
                    .reply(200, jsonContent[i]);
                break;
            }
        }
    }
}
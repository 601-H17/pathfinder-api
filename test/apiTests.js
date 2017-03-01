process.env.NODE_ENV = 'test';
import 'babel-polyfill'; 

let nock = require('nock');
let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../build/index');
let should = chai.should();
let algorithmPathfinder = require('../build/pathfinderAlgorithm')
let request = require('supertest')('https://csf-geo-app.herokuapp.com');
let fs = require("fs");
chai.use(chaiHttp);

let authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
let csfUrl = 'https://csf-geo-app.herokuapp.com';

describe("Testing API with a mocked backend", function () {

    describe("Classrooms API", function () {
        it("responds with json file response", function (done) {
            const JSON_FILE_PATH = './test/mock/classrooms.json';
            const PATH = '/api/classrooms';
            verifyJsonContentWithApi(PATH, JSON_FILE_PATH);
            request
            .get(PATH)
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.equal("G-255");
                done();
            });
        })
    });

    describe("Stairs API", function () {
        it("responds with json file response", function (done) {
            const JSON_FILE_PATH = './test/mock/stairs.json';
            const PATH = '/api/stairs';
            verifyJsonContentWithApi(PATH, JSON_FILE_PATH);
            request
            .get(PATH)
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.equal("GE-02");
                done();
            });
        })
    });
});

function verifyJsonContentWithApi(path, jsonFilePath){
    //read the json file
    var contents = fs.readFileSync(jsonFilePath);
    //parse the contents and assign to a variable
    var jsonContent = JSON.parse(contents);

    nock(csfUrl, {
        reqheaders: {
            'authorization' : 'Token token='+authToken
        }
    })
    .get(path)
    .reply(200, jsonContent);
}
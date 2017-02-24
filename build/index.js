'use strict';

var express = require('express');
require("babel-polyfill");
var app = express();
exports.app = app;
var bodyParser = require('body-parser');
var algoTools = require('./pathfinderAlgorithm');

var geojson = require('../corridors.json');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 8080;

/* ! Routes ! */
var router = express.Router();

// GET /
router.get('/', function _callee(req, res) {
    var localA, localB, path, status, error;
    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    localA = req.query.localA, localB = req.query.localB;
                    error = undefined;
                    _context.prev = 2;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(algoTools.pathfind("G-165", "G-164"));

                case 5:
                    path = _context.sent;

                    console.log(path);
                    _context.next = 12;
                    break;

                case 9:
                    _context.prev = 9;
                    _context.t0 = _context['catch'](2);

                    error = { message: "Can't find path with those locals" };

                case 12:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this, [[2, 9]]);
});

router.post('/corridors', function (req, res) {
    var corridors = req.body.map;
    var string = JSON.stringify(corridors, null, '\t');
    console.log(corridors);
    var fs = require('fs');
    fs.writeFile("./corridors.json", string, function (err) {
        if (err) {
            return console.log(err);
            res.status(400).json({ message: "File not saved", error: err });
        }
        console.log("The file was saved!");
        res.status(201).json({ message: "File saved successfully" });
    });
});

app.use('/api/pathfinder', router);

/* ! Start ! */

app.listen(port);
console.log('Server start on http://localhost:' + port);
console.log('CTRL + C to close');
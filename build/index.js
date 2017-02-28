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
    var localA, localB, fullpath, status, error, i;
    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    localA = req.query.localA, localB = req.query.localB;
                    error = undefined;
                    _context.prev = 2;

                    console.log('allo');
                    _context.next = 6;
                    return regeneratorRuntime.awrap(algoTools.pathfind("G-165", "G-164"));

                case 6:
                    fullpath = _context.sent;


                    console.log(JSON.stringify(fullpath) + '\n');
                    for (i = 0; i < fullpath.length - 1; i++) {
                        console.log('Path ' + i + ': ' + fullpath[i].path);
                        console.log('Weight ' + i + ': ' + fullpath[i].weight + '\n');
                    }
                    console.log('Total Weight : ' + fullpath[fullpath.length - 1].totalWeight + '\n');

                    _context.next = 15;
                    break;

                case 12:
                    _context.prev = 12;
                    _context.t0 = _context['catch'](2);

                    error = { message: "Can't find path with those locals" };

                case 15:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this, [[2, 12]]);
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
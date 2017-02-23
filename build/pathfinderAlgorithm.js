'use strict';

var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');
var geojson = require('../corridors.json');

var pathFinder = new PathFinder(geojson);

var originalStart = void 0;
var originalEnd = void 0;

var staircases;
var classrooms;

var shortestPath;
module.exports = {
    pathfind: function pathfind(startingPoint, destinationPoint) {
        var error;
        return regeneratorRuntime.async(function pathfind$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;


                        originalStart = ApiCallTools.getClassroom(startingPoint);
                        originalEnd = ApiCallTools.getClassroom(destinationPoint);

                        return _context.abrupt('return', pathfindRec(startingPoint, destinationPoint, []));

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);
                        error = _context.t0;

                    case 9:
                        if (error != undefined) {
                            console.log(error);
                        }

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this, [[0, 6]]);
    }
};

function pathfindRec(startingPoint, endingPoint, currentPath) {
    var startingFloor, destinationFloor, path, i;
    return regeneratorRuntime.async(function pathfindRec$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(getClassFloor(startingPoint));

                case 2:
                    startingFloor = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(getClassFloor(endingPoint));

                case 5:
                    destinationFloor = _context2.sent;


                    if (startingFloor == destinationFloor) {
                        try {
                            path = findAndPathfind(startingPoint, endingPoint);

                            currentPath.push(path);
                        } catch (e) {}
                    } else {
                        staircases = findingSameFloorStaircases(startingFloor);
                        for (i = 0; i < staircases.length; i++) {
                            if (destinationFloor <= staircases[i].floor_max) {
                                currentPath.push(findAndPathfind(startingPoint, staircases[i]));
                            }
                        }
                    }

                case 7:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this);
}

function findLocalGeo(localToFind) {
    var geojsonFile = './corridors.json';
    var file = fs.readFileSync(geojsonFile);
    var obj = JSON.parse(file);
    for (var i = 0; i < obj.features.length; i++) {
        if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == localToFind) {
            return obj.features[i];
        }
    }
}

function findingSameFloorStaircases(currentFloor) {
    var staircasesOnSameFloor;
    for (var i = 0; i < staircases.length; i++) {
        if (staircases[i].floor.equals(currentFloor)) {
            staircaseOnSameFloor.add(staircases[i]);
        }
    }
    return staircaseOnSameFloor;
}

function findAndPathfind(start, destination) {
    var start = findLocalGeo(start);
    var finish = findLocalGeo(destination);
    return pathFinder.findPath(start, finish);
}

function getClassFloor(localName) {
    var localObj;
    return regeneratorRuntime.async(function getClassFloor$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(ApiCallTools.getClassroom(localName));

                case 2:
                    localObj = _context3.sent;
                    return _context3.abrupt('return', destObj.floor);

                case 4:
                case 'end':
                    return _context3.stop();
            }
        }
    }, null, this);
}
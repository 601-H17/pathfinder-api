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
                        _context.next = 3;
                        return regeneratorRuntime.awrap(ApiCallTools.getClassroom(startingPoint));

                    case 3:
                        originalStart = _context.sent;
                        _context.next = 6;
                        return regeneratorRuntime.awrap(ApiCallTools.getClassroom(destinationPoint));

                    case 6:
                        originalEnd = _context.sent;
                        _context.next = 9;
                        return regeneratorRuntime.awrap(ApiCallTools.getAllStairs());

                    case 9:
                        staircases = _context.sent;
                        _context.next = 12;
                        return regeneratorRuntime.awrap(pathfindRecursive(startingPoint, destinationPoint, []));

                    case 12:
                        return _context.abrupt('return', shortestPath);

                    case 15:
                        _context.prev = 15;
                        _context.t0 = _context['catch'](0);
                        error = _context.t0;

                    case 18:
                        if (error != undefined) {
                            console.log(error);
                        }

                    case 19:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this, [[0, 15]]);
    }
};

function pathfindRecursive(startingPoint, endingPoint, fullPath) {
    var startingFloor, endingFloor, startingWing, endingWing, staircasesOnSameFloor, i, a;
    return regeneratorRuntime.async(function pathfindRecursive$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(getLocalFloor(startingPoint));

                case 2:
                    startingFloor = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(getLocalFloor(endingPoint));

                case 5:
                    endingFloor = _context2.sent;
                    _context2.next = 8;
                    return regeneratorRuntime.awrap(getLocalWing(startingPoint));

                case 8:
                    startingWing = _context2.sent;
                    _context2.next = 11;
                    return regeneratorRuntime.awrap(getLocalWing(endingPoint));

                case 11:
                    endingWing = _context2.sent;

                    if (!(startingFloor == endingFloor && startingWing == endingWing)) {
                        _context2.next = 16;
                        break;
                    }

                    try {
                        fullPath.push(findAndPathfind(startingPoint, endingPoint));
                        keepShortestPath(fullPath);
                    } catch (e) {
                        console.log('How is this even real?' + '\n');
                        console.log(e);
                    }
                    _context2.next = 37;
                    break;

                case 16:
                    if (!(startingWing == endingWing)) {
                        _context2.next = 37;
                        break;
                    }

                    staircasesOnSameFloor = findingSameFloorStaircases(startingFloor);
                    //console.log('SAME FLOOR: ' + JSON.stringify(staircasesOnSameFloor));

                    i = 0;

                case 19:
                    if (!(i < staircasesOnSameFloor.length)) {
                        _context2.next = 37;
                        break;
                    }

                    a = staircasesOnSameFloor[i].floor_min;

                case 21:
                    if (!(a <= staircasesOnSameFloor[i].floor_max)) {
                        _context2.next = 34;
                        break;
                    }

                    if (!(endingFloor == a)) {
                        _context2.next = 31;
                        break;
                    }

                    _context2.prev = 23;

                    fullPath.push(findAndPathfind(startingPoint, staircases[i]));
                    //return pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
                    pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
                    _context2.next = 31;
                    break;

                case 28:
                    _context2.prev = 28;
                    _context2.t0 = _context2['catch'](23);
                    return _context2.abrupt('continue', 31);

                case 31:
                    a++;
                    _context2.next = 21;
                    break;

                case 34:
                    i++;
                    _context2.next = 19;
                    break;

                case 37:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this, [[23, 28]]);
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
    var staircasesOnSameFloor = [];
    //console.log('AVANT: ' + JSON.stringify(staircases) + '\n');
    for (var i = 0; i < staircases.length; i++) {
        if (currentFloor >= staircases[i].floor_min && currentFloor <= staircases[i].floor_max) {
            staircasesOnSameFloor.push(staircases[i]);
        }
    }
    return staircasesOnSameFloor;
}

function findingSameWingAndFloorStaircases(currentWing, currentFloor) {
    var staircasesOnSameWingAndFloor = [];
    for (var i = 0; i < staircases.length; i++) {
        if ( /*staircases[i].wing.equals(currentWing) && */staircases[i].floor == currentFloor) {
            staircasesOnSameWingAndFloor.push(staircases[i]);
        }
    }
    return staircasesOnSameWingAndFloor;
}

function findAndPathfind(start, destination) {
    var start = findLocalGeo(start);
    var finish = findLocalGeo(destination);
    return pathFinder.findPath(start, finish);
}

function getLocalFloor(localName) {
    var localObj;
    return regeneratorRuntime.async(function getLocalFloor$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    if (!(localName.charAt(1) == 'E')) {
                        _context3.next = 6;
                        break;
                    }

                    _context3.next = 3;
                    return regeneratorRuntime.awrap(ApiCallTools.getStaircase(localName));

                case 3:
                    localObj = _context3.sent;
                    _context3.next = 9;
                    break;

                case 6:
                    _context3.next = 8;
                    return regeneratorRuntime.awrap(ApiCallTools.getClassroom(localName));

                case 8:
                    localObj = _context3.sent;

                case 9:
                    console.log(JSON.stringify(localObj) + '\n');
                    return _context3.abrupt('return', localObj.floor);

                case 11:
                case 'end':
                    return _context3.stop();
            }
        }
    }, null, this);
}

function getLocalWing(localName) {
    var localObj;
    return regeneratorRuntime.async(function getLocalWing$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    if (!(localName.charAt(1) == 'E')) {
                        _context4.next = 6;
                        break;
                    }

                    _context4.next = 3;
                    return regeneratorRuntime.awrap(ApiCallTools.getStaircase(localName));

                case 3:
                    localObj = _context4.sent;
                    _context4.next = 9;
                    break;

                case 6:
                    _context4.next = 8;
                    return regeneratorRuntime.awrap(ApiCallTools.getClassroom(localName));

                case 8:
                    localObj = _context4.sent;

                case 9:
                    return _context4.abrupt('return', localObj.wing);

                case 10:
                case 'end':
                    return _context4.stop();
            }
        }
    }, null, this);
}

function keepShortestPath(fullPath) {
    var totalWeight = 0;
    for (var i = 0; i < fullPath.length; i++) {
        totalWeight += fullPath[i].weight;
    }
    fullPath.push({ "totalWeight": totalWeight });
    if (shortestPath === undefined) {
        shortestPath = fullPath;
    } else if (totalWeight < shortestPath.weight) {
        shortestPath = fullPath;
    }
}
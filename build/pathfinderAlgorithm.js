'use strict';

var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');

var originalStart = void 0;
var originalEnd = void 0;

var staircases;
var classrooms;

var shortestPath = undefined;

var corridorsModuleByFloor = {
    1: '../json_files/corridors.json',
    2: '../json_files/corridors2.json'
};

var corridorsFileByFloor = {
    1: './json_files/corridors.json',
    2: './json_files/corridors2.json'
};

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
                        return regeneratorRuntime.awrap(pathfindRecursive(startingPoint, destinationPoint, originalStart.floor, []));

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

function pathfindRecursive(startingPoint, endingPoint, currentFloor, fullPath) {
    var startingObj, endingObj, staircasesOnSameFloor, i, a;
    return regeneratorRuntime.async(function pathfindRecursive$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(getLocal(startingPoint));

                case 2:
                    startingObj = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(getLocal(endingPoint));

                case 5:
                    endingObj = _context2.sent;

                    if (!(currentFloor == endingObj.floor && startingObj.wing == endingObj.wing)) {
                        _context2.next = 10;
                        break;
                    }

                    try {
                        fullPath.push(findAndPathfind(startingObj, endingObj));
                        keepShortestPath(fullPath);
                    } catch (e) {
                        console.log('How is this even real?' + '\n');
                        console.log(e);
                    }
                    _context2.next = 33;
                    break;

                case 10:
                    if (!(startingObj.wing == endingObj.wing)) {
                        _context2.next = 33;
                        break;
                    }

                    staircasesOnSameFloor = findingSameFloorStaircases(startingObj.floor);
                    i = 0;

                case 13:
                    if (!(i < staircasesOnSameFloor.length)) {
                        _context2.next = 33;
                        break;
                    }

                    if (!(currentFloor >= staircasesOnSameFloor[i].floor_min)) {
                        _context2.next = 30;
                        break;
                    }

                    a = staircasesOnSameFloor[i].floor_min;

                case 16:
                    if (!(a <= staircasesOnSameFloor[i].floor_max)) {
                        _context2.next = 30;
                        break;
                    }

                    if (!(endingObj.floor == a)) {
                        _context2.next = 27;
                        break;
                    }

                    _context2.prev = 18;

                    fullPath.push(findAndPathfind(startingObj, staircasesOnSameFloor[i]));
                    //return pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
                    _context2.next = 22;
                    return regeneratorRuntime.awrap(pathfindRecursive(staircasesOnSameFloor[i].name, endingObj.name, a, fullPath));

                case 22:
                    _context2.next = 27;
                    break;

                case 24:
                    _context2.prev = 24;
                    _context2.t0 = _context2['catch'](18);
                    return _context2.abrupt('continue', 27);

                case 27:
                    a++;
                    _context2.next = 16;
                    break;

                case 30:
                    i++;
                    _context2.next = 13;
                    break;

                case 33:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this, [[18, 24]]);
}

function findLocalGeo(localToFind, floor) {
    var file = fs.readFileSync(corridorsFileByFloor[floor]);
    var obj = JSON.parse(file);
    for (var i = 0; i < obj.features.length; i++) {
        if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == localToFind.name) {
            return obj.features[i];
        }
    }
}

function findAndPathfind(start, destination) {
    var pathFloor;
    try {
        pathFloor = start.floor;
        var geoFile = require(corridorsModuleByFloor[pathFloor]);
    } catch (e) {
        pathFloor = destination.floor;
        var geoFile = require(corridorsModuleByFloor[pathFloor]);
    }

    var startGeo = findLocalGeo(start, pathFloor);
    var destinationGeo = findLocalGeo(destination, pathFloor);

    var pathfinder = new PathFinder(geoFile);
    var path = pathfinder.findPath(startGeo, destinationGeo);
    path['floorPath'] = pathFloor;
    return path;
}

function findingSameFloorStaircases(currentFloor) {
    var staircasesOnSameFloor = [];
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

function getLocal(localName) {
    var localObj;
    return regeneratorRuntime.async(function getLocal$(_context3) {
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
                    return _context3.abrupt('return', localObj);

                case 10:
                case 'end':
                    return _context3.stop();
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
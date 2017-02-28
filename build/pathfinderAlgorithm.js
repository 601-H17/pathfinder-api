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
                        return regeneratorRuntime.awrap(ApiCallTools.getAllStairs());

                    case 3:
                        staircases = _context.sent;

                        console.log(staircases);

                        /*var path = findAndPathfind(startingPoint, destinationPoint);
                        return path;*/
                        //return pathfindRecursive(startingPoint, destinationPoint, []);


                        /*else {
                            staircases = findingSameFloorStaircases(currentFloor);
                            for(var i = 0; i < staircases.length; i++){
                                var staircase = staircases[i];
                                fullPath.push(findAndPathfind(startingPoint, staircase.name));
                                //TODO: Faire attention: si le local n'est pas accessible -> dropper le fullPath et passer au prochain
                                fullPath.push(findAndPathfind(staircase.name, destinationPoint));
                                  
                                var totalWeight;
                                for(var a = 0; a < fullPath.length; a++){
                                    totalWeight += fullPath[i].weight;
                                }
                                fullPath.push(totalWeight);
                                if(totalWeight < shortestPath.weight){
                                    shortestPath = fullPath;
                                }
                                fullPath = [];
                            }
                        }*/
                        _context.next = 10;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);
                        error = _context.t0;

                    case 10:
                        if (error != undefined) {
                            console.log(error);
                        }

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this, [[0, 7]]);
    }
};

function pathfindRecursive(startingPoint, endingPoint, fullPath) {
    var startingFloor, endingFloor, startingWing, endingWing, i, a;
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
                        _context2.next = 23;
                        break;
                    }

                    _context2.prev = 13;

                    fullPath.push(findAndPathfind(startingPoint, endingPoint));
                    return _context2.abrupt('return', fullPath);

                case 18:
                    _context2.prev = 18;
                    _context2.t0 = _context2['catch'](13);

                    console.log('How is this even real?');

                case 21:
                    _context2.next = 44;
                    break;

                case 23:
                    if (!(startingWing == endingWing)) {
                        _context2.next = 44;
                        break;
                    }

                    staircases = findingSameFloorStaircases(startingFloor);
                    i = 0;

                case 26:
                    if (!(i < staircases.length)) {
                        _context2.next = 44;
                        break;
                    }

                    a = staircases[i].floor_min;

                case 28:
                    if (!(a <= staircases[i].floor_max)) {
                        _context2.next = 41;
                        break;
                    }

                    if (!(endingFloor == a)) {
                        _context2.next = 38;
                        break;
                    }

                    _context2.prev = 30;

                    fullPath.push(findAndPathfind(startingPoint, staircases[i]));
                    return _context2.abrupt('return', pathfindRecursive(staircases[i].name, endingPoint, fullPath));

                case 35:
                    _context2.prev = 35;
                    _context2.t1 = _context2['catch'](30);
                    return _context2.abrupt('continue', 38);

                case 38:
                    a++;
                    _context2.next = 28;
                    break;

                case 41:
                    i++;
                    _context2.next = 26;
                    break;

                case 44:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this, [[13, 18], [30, 35]]);
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

function findingSameWingAndFloorStaircases(currentWing, currentFloor) {
    var staircasesOnSameWingAndFloor;
    for (var i = 0; i < staircases.length; i++) {
        if (staircases[i].wing.equals(currentWing) && staircases[i].floor.equals(currentFloor)) {
            staircaseOnSameWingAndFloor.add(staircases[i]);
        }
    }
    return staircaseOnSameWingAndFloor;
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
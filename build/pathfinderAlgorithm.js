'use strict';

var ApiCallTools = require('./ApiRequest');
var Pathfinder = require('geojson-path-finder');

module.exports = {
    pathfind: function pathfind(startingLocal, destinationLocal) {
        var classrooms, error;
        return regeneratorRuntime.async(function pathfind$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return regeneratorRuntime.awrap(ApiCallTools.getAllClassrooms());

                    case 3:
                        classrooms = _context.sent;

                        //var classroom = ApiCallTools.getClassroom("G-165");
                        //var staircases = ApiCallTools.getAllStairs();
                        console.log(classrooms);
                        //console.log(classroom);

                        //var startingFloor = ApiCallTools.getClassroom(startingLocal).floor;
                        //var endingFloor = ApiCallTools.getClassroom(destinationLocal).floor;

                        /*
                        if(startingFloor.equals(endingFloor)){
                            var finish = findLocal(destinationLocal);
                            var pathFinder = new PathFinder(geojson);
                            path = pathFinder.findPath(startingLocal, finish);
                        }
                        else {
                            findingSameFloorStaircases(currentFloor);
                        } */

                        _context.next = 10;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);
                        error = 'ERREUR !?!?!?!?!? :( ';

                    case 10:
                        if (error != undefined) {
                            console.log("Yo y'a une erreur");
                        }

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this, [[0, 7]]);
    }
};

function findLocalGeo(localToFind) {
    var file = fs.readFileSync('./corridors.json');
    var obj = JSON.parse(file);
    for (var i = 0; i < obj.features.length; i++) {
        if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == toFind) {
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
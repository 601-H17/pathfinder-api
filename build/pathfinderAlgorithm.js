'use strict';

var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');
var geojson = require('../corridors.json');

var pathFinder = new PathFinder(geojson);
var staircases;
var classrooms;
module.exports = {
    pathfind: function pathfind(startingLocal, destinationLocal) {
        var startObj, destObj, startingFloor, destinationFloor, start, finish, path;
        return regeneratorRuntime.async(function pathfind$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(ApiCallTools.getClassroom(startingLocal));

                    case 2:
                        startObj = _context.sent;
                        _context.next = 5;
                        return regeneratorRuntime.awrap(ApiCallTools.getClassroom(destinationLocal));

                    case 5:
                        destObj = _context.sent;
                        startingFloor = startObj.floor;
                        destinationFloor = destObj.floor;


                        if (startingFloor == destinationFloor) {
                            start = findLocalGeo(startingLocal);
                            finish = findLocalGeo(destinationLocal);
                            path = pathFinder.findPath(start, finish);

                            console.log(path);
                        } else {}
                        //findingSameFloorStaircases(currentFloor);

                        //}
                        /* catch(e){
                             var error = 'ERREUR !?!?!?!?!? :( ';
                         }
                         if (error != undefined){
                             console.log("Yo y'a une erreur");
                         }*/

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this);
    }
};

function findLocalGeo(localToFind) {
    var file = fs.readFileSync('./corridors.json');
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
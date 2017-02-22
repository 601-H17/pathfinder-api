'use strict';

var ApiCallTools = require('./ApiRequest');
var Pathfinder = require('geojson-path-finder');
var fs = require('fs');
var geojson = require('../corridors.json');

var pathFinder = new PathFinder(geojson);
var staircases;
var classrooms;
module.exports = {
    pathfind: function pathfind(startingLocal, destinationLocal) {
        var startingFloor, endingFloor, start, finish;
        return regeneratorRuntime.async(function pathfind$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // try{
                        /* classrooms = await ApiCallTools.getAllClassrooms();
                         console.log(classrooms);*/

                        /* var destinationLocal = await ApiCallTools.getClassroom(destinationLocal);
                         console.log(classroom);*/

                        /* staircases = await ApiCallTools.getAllStairs();
                         console.log(staircases);*/

                        startingFloor = ApiCallTools.getClassroom(startingLocal).floor;
                        endingFloor = ApiCallTools.getClassroom(destinationLocal).floor;


                        if (startingFloor == endingFloor) {
                            start = findLocalGeo(startingFloor);
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

                    case 3:
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
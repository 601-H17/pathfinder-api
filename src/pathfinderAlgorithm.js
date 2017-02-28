var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');
var geojson = require('../corridors.json');

var pathFinder = new PathFinder(geojson);

let originalStart;
let originalEnd;

var staircases;
var classrooms;

var shortestPath;
module.exports = {
    pathfind: async function (startingPoint, destinationPoint) {
        try{

            originalStart = await ApiCallTools.getClassroom(startingPoint);
            originalEnd = await ApiCallTools.getClassroom(destinationPoint);

            staircases = await ApiCallTools.getAllStairs();
            console.log(staircases);

            return pathfindRecursive(startingPoint, destinationPoint, []);
            
            
            /*
                var totalWeight;
                for(var a = 0; a < fullPath.length; a++){
                    totalWeight += fullPath[i].weight;
                }
                fullPath.push(totalWeight);
                if(totalWeight < shortestPath.weight){
                    shortestPath = fullPath;
                }
                fullPath = [];
            */
        }
        catch(e){
            var error = e;
        }
        if (error != undefined){
            console.log(error);
        }
    }
}

async function pathfindRecursive(startingPoint, endingPoint, fullPath){

    var startingFloor = await getLocalFloor(startingPoint);
    var endingFloor = await getLocalFloor(endingPoint);

    var startingWing = await getLocalWing(startingPoint);
    var endingWing = await getLocalWing(endingPoint);

    if(startingFloor == endingFloor && startingWing == endingWing){
        try{
            fullPath.push(findAndPathfind(startingPoint, endingPoint));
            return fullPath;
        }
        catch(e){
            console.log('How is this even real?');
        }
    }
    else if (startingWing == endingWing) {
        staircases = findingSameFloorStaircases(startingFloor);
            for(var i = 0; i < staircases.length; i++){
                for(var a = staircases[i].floor_min; a <= staircases[i].floor_max; a++){
                    if(endingFloor == a){
                        try{
                            fullPath.push(findAndPathfind(startingPoint, staircases[i]));
                            return pathfindRecursive(staircases[i].name, endingPoint, fullPath);
                        } catch(e){ continue; }
                    }
                }
            }
    }
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

function findingSameFloorStaircases(currentFloor){
    var staircasesOnSameFloor;
    for(var i = 0; i < staircases.length; i++){
        if(staircases[i].floor.equals(currentFloor)){
            staircaseOnSameFloor.add(staircases[i]);
        }
    }
    return staircaseOnSameFloor;
}

function findingSameWingAndFloorStaircases(currentWing, currentFloor) {
    var staircasesOnSameWingAndFloor;
        for(var i = 0; i < staircases.length; i++){
        if(staircases[i].wing.equals(currentWing) && staircases[i].floor.equals(currentFloor)){
            staircaseOnSameWingAndFloor.add(staircases[i]);
        }
    }
    return staircaseOnSameWingAndFloor;
}

function findAndPathfind(start, destination){
     var start = findLocalGeo(start);
     var finish = findLocalGeo(destination);
     return pathFinder.findPath(start, finish);
}

async function getLocalFloor(localName){
    var localObj = await ApiCallTools.getClassroom(localName);
    return destObj.floor;
}
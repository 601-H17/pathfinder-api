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

            originalStart = ApiCallTools.getClassroom(startingPoint);
            originalEnd = ApiCallTools.getClassroom(destinationPoint);
            var path = findAndPathfind(startingPoint, destinationPoint);
            return path;
            //return pathfindRec(startingPoint, destinationPoint, []);
            
            
            /*else {
                staircases = findingSameFloorStaircases(currentFloor);
                for(var i = 0; i < staircases.length; i++){
                    var staircase = staircases[i];
                    currentPath.push(findAndPathfind(startingPoint, staircase.name));
                    //TODO: Faire attention: si le local n'est pas accessible -> dropper le currentPath et passer au prochain
                    currentPath.push(findAndPathfind(staircase.name, destinationPoint));

                    
                    var totalWeight;
                    for(var a = 0; a < currentPath.length; a++){
                        totalWeight += currentPath[i].weight;
                    }
                    currentPath.push(totalWeight);
                    if(totalWeight < shortestPath.weight){
                        shortestPath = currentPath;
                    }
                    currentPath = [];
                }
            }*/
        }
        catch(e){
            var error = e;
        }
        if (error != undefined){
            console.log(error);
        }
    }
}

async function pathfindRec(startingPoint, endingPoint, currentPath){

    var startingFloor = await getClassFloor(startingPoint);
    var destinationFloor = await getClassFloor(endingPoint);

    if(startingFloor == destinationFloor){
        /*try{
            var path = findAndPathfind(startingPoint, endingPoint);
            currentPath.push(path);
        }
        catch(e){

        }*/
        var path = findAndPathfind(startingPoint, endingPoint);
        return path;
    }
    else{
        staircases = findingSameFloorStaircases(startingFloor);
            for(var i = 0; i < staircases.length; i++){
                if(destinationFloor <= staircases[i].floor_max){
                    currentPath.push(findAndPathfind(startingPoint, staircases[i]));

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

function findAndPathfind(start, destination){
     var start = findLocalGeo(start);
     var finish = findLocalGeo(destination);
     return pathFinder.findPath(start, finish);
}

async function getClassFloor(localName){
    var localObj = await ApiCallTools.getClassroom(localName);
    return destObj.floor;
}
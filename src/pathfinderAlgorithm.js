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

            await pathfindRecursive(startingPoint, destinationPoint, []);
            return shortestPath;
        } catch(e){ var error = e; }
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
            keepShortestPath(fullPath);
        }
        catch(e){
            console.log('How is this even real?' + '\n');
            console.log(e);
        }
    }
    else if (startingWing == endingWing) {
        var staircasesOnSameFloor = findingSameFloorStaircases(startingFloor);
            for(var i = 0; i < staircasesOnSameFloor.length; i++){
                for(var a = staircasesOnSameFloor[i].floor_min; a <= staircasesOnSameFloor[i].floor_max; a++){
                    if(endingFloor == a){
                        try{
                            fullPath.push(findAndPathfind(startingPoint, staircases[i]));
                            //return pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
                            pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
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
    var staircasesOnSameFloor = [];
    for(var i = 0; i < staircases.length; i++){
        if(currentFloor >= staircases[i].floor_min && currentFloor <= staircases[i].floor_max){
            staircasesOnSameFloor.push(staircases[i]);
        }
    }
    return staircasesOnSameFloor;
}

function findingSameWingAndFloorStaircases(currentWing, currentFloor) {
    var staircasesOnSameWingAndFloor = [];
        for(var i = 0; i < staircases.length; i++){
        if(/*staircases[i].wing.equals(currentWing) && */staircases[i].floor == currentFloor){
            staircasesOnSameWingAndFloor.push(staircases[i]);
        }
    }
    return staircasesOnSameWingAndFloor;
}

function findAndPathfind(start, destination){
     var start = findLocalGeo(start);
     var finish = findLocalGeo(destination);
     return pathFinder.findPath(start, finish);
}

async function getLocalFloor(localName){
    var localObj;
    if(localName.charAt(1) == 'E'){
        localObj = await ApiCallTools.getStaircase(localName);
    } else{ localObj = await ApiCallTools.getClassroom(localName);}
    console.log(JSON.stringify(localObj) + '\n');
    return localObj.floor;
}

async function getLocalWing(localName){
    var localObj;
    if(localName.charAt(1) == 'E'){
        localObj = await ApiCallTools.getStaircase(localName);
    } else{ localObj = await ApiCallTools.getClassroom(localName); }
    return localObj.wing;
}

function keepShortestPath(fullPath) {
    var totalWeight = 0;
    for(var i = 0; i < fullPath.length; i++){
        totalWeight += fullPath[i].weight;
    }
    fullPath.push({"totalWeight" : totalWeight});
    if(shortestPath === undefined){
        shortestPath = fullPath;
    }
    else if(totalWeight < shortestPath.weight){
        shortestPath = fullPath;
    }
}
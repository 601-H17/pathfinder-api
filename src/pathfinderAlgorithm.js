var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');

let originalStart;
let originalEnd;

var staircases;
var classrooms;

var shortestPath = undefined;

const corridorsModuleByFloor = { 
    1: '../json_files/corridors.json',
    2: '../json_files/corridors2.json'
};

const corridorsFileByFloor = {
    1: './json_files/corridors.json',
    2: './json_files/corridors2.json'
};

module.exports = {
    pathfind: async function (startingPoint, destinationPoint) {
        try{
            originalStart = await ApiCallTools.getClassroom(startingPoint);
            originalEnd = await ApiCallTools.getClassroom(destinationPoint);

            staircases = await ApiCallTools.getAllStairs();

            await pathfindRecursive(startingPoint, destinationPoint, originalStart.floor, []);
            return shortestPath;
        } catch(e){ var error = e; }
        if (error != undefined){
           console.log(error);
        }
    }
}

async function pathfindRecursive(startingPoint, endingPoint, currentFloor, fullPath){

    var startingObj = await getLocal(startingPoint);
    var endingObj = await getLocal(endingPoint);

    if(currentFloor == endingObj.floor && startingObj.wing == endingObj.wing){
        try{
            fullPath.push(findAndPathfind(startingObj, endingObj));
            keepShortestPath(fullPath);
        }
        catch(e){
            console.log('How is this even real?' + '\n');
            console.log(e);
        }
    }
    else if (startingObj.wing == endingObj.wing) {
        var staircasesOnSameFloor = findingSameFloorStaircases(startingObj.floor);
        for(var i = 0; i < staircasesOnSameFloor.length; i++){
            if(currentFloor >= staircasesOnSameFloor[i].floor_min){
                for(var a = staircasesOnSameFloor[i].floor_min; a <= staircasesOnSameFloor[i].floor_max; a++){
                    if(endingObj.floor == a){
                        try{
                            fullPath.push(findAndPathfind(startingObj, staircasesOnSameFloor[i]));
                            //return pathfindRecursive(staircasesOnSameFloor[i].name, endingPoint, fullPath);
                            await pathfindRecursive(staircasesOnSameFloor[i].name, endingObj.name, a, fullPath);
                        } catch(e){ continue; }
                    }
                }
            }
        }
    }
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

function findAndPathfind(start, destination){
    var pathFloor;
    try{
        pathFloor = start.floor;
        var geoFile = require(corridorsModuleByFloor[pathFloor]);
    }
    catch(e){ 
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

async function getLocal(localName){
    var localObj;
    if(localName.charAt(1) == 'E'){
        localObj = await ApiCallTools.getStaircase(localName);
    } else{ localObj = await ApiCallTools.getClassroom(localName); }
    return localObj;
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
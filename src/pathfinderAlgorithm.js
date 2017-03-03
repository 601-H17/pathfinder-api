var ApiCallTools = require('./ApiRequest');
var PathFinder = require('geojson-path-finder');
var fs = require('fs');

var staircases;
var classrooms;

var shortestPath;

const classroomPath = '/api/classroom/';
const allClassroomsPath = '/api/classrooms';
const allStairsPath = '/api/stairs';
const staircasePath = '/api/stair/';

const ERROR_MESSAGES = {
    localNotFound: "Un ou des locaux passés n'existent pas !",
    wingToWingNotImplemented: "Le pathfinding d'une aile vers l'autre n'est pas implémenté."
};

const CORRIDORS_MODULE_BY_FLOOR = { 
    1: '../json_files/corridors.json',
    2: '../json_files/corridors2.json'
};

const CORRIDORS_FILE_BY_FLOOR = {
    1: './json_files/corridors.json',
    2: './json_files/corridors2.json'
};

module.exports = {
    pathfind: async function (startingPoint, destinationPoint) {
        try{
            shortestPath = undefined;
            var startObj = await ApiCallTools.getFromAPI(classroomPath + startingPoint);
            var endObj = await ApiCallTools.getFromAPI(classroomPath + destinationPoint);

            staircases = await ApiCallTools.getFromAPI(allStairsPath);

            await pathfindRecursive(startingPoint, destinationPoint, startObj.floor, []);
            return shortestPath;

        } catch(e){ var error = e; }

        if (error != undefined){
           console.error(error);
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
            console.error(e);
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
                            await pathfindRecursive(staircasesOnSameFloor[i].name, endingObj.name, a, fullPath);
                        } catch(e){ 
                            console.error(e);
                            continue; 
                        }
                    }
                }
            }
        }
    }
    else{
        //Non implémenté
    }
}

function findLocalGeo(localToFind, floor) {
    var file = fs.readFileSync(CORRIDORS_FILE_BY_FLOOR[floor]);
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
        var geoFile = require(CORRIDORS_MODULE_BY_FLOOR[pathFloor]);
    }
    catch(e){ 
        pathFloor = destination.floor;
        var geoFile = require(CORRIDORS_MODULE_BY_FLOOR[pathFloor]);
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
        localObj = await ApiCallTools.getFromAPI(staircasePath + localName);
    } else{ localObj = await ApiCallTools.getFromAPI(classroomPath + localName); }
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
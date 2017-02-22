var ApiCallTools = require('./ApiRequest');
var Pathfinder = require('geojson-path-finder');
module.exports = {
    pathfind: async function (startingLocal, destinationLocal) {
        try{
            
            //var classroom = ApiCallTools.getClassroom("G-165");
            //var staircases = ApiCallTools.getAllStairs();
            
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
            var classrooms = await ApiCallTools.getAllClassrooms();
            console.log(classrooms);
        }
        catch(e){
            var error = 'ERREUR !?!?!?!?!? :( ';
        }
        if (error != undefined){
            console.log("Yo y'a une erreur");
        }
    }
}

function findLocalGeo(localToFind) {
    var file = fs.readFileSync('./corridors.json');
    var obj = JSON.parse(file);
    for (var i = 0; i < obj.features.length; i++) {
        if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == toFind) {
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
var ApiCallTools = require('./ApiRequest');

module.exports = {
    pathfind: async function (startingLocal, destinationLocal) {
        try{
            var classrooms = ApiCallTools.getAllClassrooms();
            var startingFloor = ApiCallTools.getClassroom(startingLocal).substring(2,3);
            var endingFloor = ApiCallTools.getClassroom(destinationLocal).substring(2,3);
            /*
            if(startingFloor.equals(endingFloor)){
                var finish = findLocal(destinationLocal);
                var pathFinder = new PathFinder(geojson);
                path = pathFinder.findPath(startingLocal, finish);
            }
            else {
                findingSameFloorStaircases(currentFloor);
            } */

            function findLocal(toFind) {
                var file = fs.readFileSync('./corridors.json');
                var obj = JSON.parse(file);
                for (var i = 0; i < obj.features.length; i++) {
                    if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == toFind) {
                        return obj.features[i];
                    }
                }
            }

            function findingSameFloorStaircases(currentFloor){
                var staircaseOnSameFloor;
                var markerList = classrooms;
                for(var i = 0; i < markerList.length; i++){
                    var staircase = markerList[i].substring(1,2);
                    var staircaseFloor = markerList[i].substring(2,3);
                    var staircaseWing = markerList[i].substring(0,1);
                    if(staircase.equals("E") && staircaseFloor.equals(currentFloor)){
                        staircaseOnSameFloor.add(markerList[i]);
                    }
                }
                return staircaseOnSameFloor.toArray(new String[staircaseOnSameFloor.size()]);
            }

            console.log(classrooms);
        }
        catch(e){
            var error = 'ERREUR !?!?!?!?!? :( ';
        }
        if (error != undefined){
            console.log("YO");
        }
    }
}





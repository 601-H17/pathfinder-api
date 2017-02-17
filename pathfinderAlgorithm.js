var ApiCallTools = require('./ApiRequest');

module.exports = {
    pathfind: async function (startingLocal, destinationLocal) {
        try{
            var classrooms = ApiCallTools.getAllClassrooms();
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





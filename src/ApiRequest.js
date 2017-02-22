var https = require("https");
var fetch = require('node-fetch');


module.exports = {
    getClassroom: async function(localName){
        let classroomPath = '/api/classroom/'+localName;
        let classroom = await getApiResponse(classroomPath);
        return classroom;
    },

    getAllClassrooms: async function(){
        let allClassroomsPath = '/api/classrooms';
        let classrooms = await getApiResponse(allClassroomsPath);
        return classrooms;
    },

    getAllStairs: async function(){
        let allStairsPath = '/api/staircases';
        let staircases = await getApiResponse(allStairsPath);
        return staircases;
    }

}

async function getApiResponse(apiPath){
    let response = await fetch(csfUrl+apiPath, { headers: {'Authorization': 'Token token='+authToken }})
    return await response.json();
}

let authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
let csfUrl = 'https://csf-geo-app.herokuapp.com';
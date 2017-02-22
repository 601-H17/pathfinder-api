var https = require("https");
var fetch = require('node-fetch');


module.exports = {
    getClassroom: function(localName){
        var classroomPath = '/api/classroom/'+localName;
        return getApiResponse(allClassroomsPath);
    },

        var jsonResponse;
        fetch('https://csf-geo-app.herokuapp.com/api/classrooms', { headers: {'Authorization': 'Token token='+authToken }})
        .then(function(response) { return response.json(); })
        .then(function(json) {
            jsonResponse = Promise.resolve(json)
        });
           //console.log(json);    
        
        console.log(jsonResponse);
        //var allClassroomsPath = '/api/classrooms';
        //return getApiResponse(allClassroomsPath);
        //return jsonResponse;
    },

    getAllStairs: function(){
        var allStairsPath = '/api/staircases';
        return getApiResponse(allStairsPath);
    }

}

function getApiResponse(apiPath){
    fetch('https://csf-geo-app.herokuapp.com', { 
        method: 'GET', 
        port: 443, 
        path: apiPath, 
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token token='+authToken 
        }
    })
    .then(function(json) {
        return json;
    }).catch(function(json){
        console.log(json);
    })
}

var authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';

'use strict';

var https = require("https");
var fetch = require('node-fetch');

module.exports = {
    getClassroom: function getClassroom(localName) {
        var classroomPath = '/api/classroom/' + localName;
        return getApiResponse(allClassroomsPath);
    },

    getAllClassrooms: function getAllClassrooms() {
        var jsonResponse;
        return regeneratorRuntime.async(function getAllClassrooms$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fetch('https://csf-geo-app.herokuapp.com/api/classrooms', { headers: { 'Authorization': 'Token token=' + authToken } }).then(function (response) {
                            return response.json();
                        }).then(function (json) {
                            jsonResponse = Promise.resolve(json);
                        });
                        //console.log(json);    

                        console.log(jsonResponse);
                        //var allClassroomsPath = '/api/classrooms';
                        //return getApiResponse(allClassroomsPath);
                        //return jsonResponse;

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this);
    },

    getAllStairs: function getAllStairs() {
        var allStairsPath = '/api/staircases';
        return getApiResponse(allStairsPath);
    }

};

function getApiResponse(apiPath) {
    fetch('https://csf-geo-app.herokuapp.com', {
        method: 'GET',
        port: 443,
        path: apiPath,
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token token=' + authToken
        }
    }).then(function (json) {
        return json;
    }).catch(function (json) {
        console.log(json);
    });
}

var authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
'use strict';

var https = require("https");
var fetch = require('node-fetch');

module.exports = {
    getClassroom: function getClassroom(localName) {
        var classroomPath, classroom;
        return regeneratorRuntime.async(function getClassroom$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        classroomPath = '/api/classroom/' + localName;
                        _context.next = 3;
                        return regeneratorRuntime.awrap(getApiResponse(classroomPath));

                    case 3:
                        classroom = _context.sent;
                        return _context.abrupt('return', classroom);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, this);
    },

    getAllClassrooms: function getAllClassrooms() {
        var allClassroomsPath, classrooms;
        return regeneratorRuntime.async(function getAllClassrooms$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        allClassroomsPath = '/api/classrooms';
                        _context2.next = 3;
                        return regeneratorRuntime.awrap(getApiResponse(allClassroomsPath));

                    case 3:
                        classrooms = _context2.sent;
                        return _context2.abrupt('return', classrooms);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, null, this);
    },

    getAllStairs: function getAllStairs() {
        var allStairsPath, staircases;
        return regeneratorRuntime.async(function getAllStairs$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        allStairsPath = '/api/staircases';
                        _context3.next = 3;
                        return regeneratorRuntime.awrap(getApiResponse(allStairsPath));

                    case 3:
                        staircases = _context3.sent;
                        return _context3.abrupt('return', staircases);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, null, this);
    }

};

function getApiResponse(apiPath) {
    var response;
    return regeneratorRuntime.async(function getApiResponse$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(fetch(csfUrl + apiPath, { headers: { 'Authorization': 'Token token=' + authToken } }));

                case 2:
                    response = _context4.sent;
                    _context4.next = 5;
                    return regeneratorRuntime.awrap(response.json());

                case 5:
                    return _context4.abrupt('return', _context4.sent);

                case 6:
                case 'end':
                    return _context4.stop();
            }
        }
    }, null, this);
}

var authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
var csfUrl = 'https://csf-geo-app.herokuapp.com';
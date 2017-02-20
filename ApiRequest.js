var https = require("https");

module.exports = {
    getClassroom: function(localName){
        
        var options = {
            host: 'csf-geo-app.herokuapp.com',
            port: 443,
            path: '/api/classroom/'+localName,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token token='+authToken
            }
        }

        var classroom = undefined;

        getApiCall(options, function(statusCode, result){
            console.log(statusCode);
            console.log("classroom " + result.name);
            classroom = result;
        });
        
        return classroom;
    },

    getAllClassrooms: function(){
        var options = {
            host: 'csf-geo-app.herokuapp.com',
            port: 443,
            path: '/api/classrooms',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token token='+authToken
            }
        }

        return classrooms = getApiCall(options, function(statusCode, result){
                            console.log(statusCode);
                            console.log("classrooms "+result);
                            return result;
                        });
    },

    getAllStairs: function(){
        var options = {
            host: 'csf-geo-app;herokuapp.com',
            port: 443,
            path: '/api/staircases',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token token='+authToken
            }
        }

        var staircases = null;

        getApiCall(options, function(statusCode, result){
            console.log(statusCode);
            staircases = result;
        })

        return staircases;
    }

}

function getApiCall(options, onResult){
    var prot = https;
    var req = prot.request(options, function(res){
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
}

var authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
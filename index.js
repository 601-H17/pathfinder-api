var express = require('express');
var app = express();
exports.app = app;
var bodyParser = require('body-parser');
var PathFinder = require('geojson-path-finder');
//var algoTools = require('./pathfinderAlgorithm');

var geojson = require('./corridors.json');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 8080;

/* ! Routes ! */
var router = express.Router();

// GET /
router.get('/', function(req, res) {
    var localA = req.query.localA,
        localB = req.query.localB;
    var path;
    var status;
    var error = undefined;
    // console.log(localA);
    // console.log(localB);

    var fs = require('fs');
    try {
        var start = findLocal(localA);
        var finish = findLocal(localB);

        function findLocal(toFind) {
            var file = fs.readFileSync('./corridors.json');
            var obj = JSON.parse(file);
            for (var i = 0; i < obj.features.length; i++) {
                if (obj.features[i].geometry.type == "Point" && obj.features[i].properties.ref != null && obj.features[i].properties.ref == toFind) {
                    return obj.features[i];
                }
            }
        }

        var pathFinder = new PathFinder(geojson);
        path = pathFinder.findPath(start, finish);
        //algoTools.pathfind();
    } catch (e) {
        error = { message: "Can't find path with those locals" };
    }

    if (error == undefined) {
        res.status(200).json(path);
    } else {
        res.status(404).json({ error });
    }
});

router.post('/corridors', function(req, res) {
    var corridors = req.body.map;
    var string = JSON.stringify(corridors, null, '\t');
    console.log(corridors);
    var fs = require('fs');
    fs.writeFile("./corridors.json", string, function(err) {
        if (err) {
            return console.log(err);
            res.status(400).json({ message: "File not saved", error: err });
        }
        console.log("The file was saved!");
        res.status(201).json({ message: "File saved successfully" });
    });
});

app.use('/api/pathfinder', router);


/* ! Start ! */

app.listen(port);
console.log('Server start on http://localhost:' + port);
console.log('CTRL + C to close');
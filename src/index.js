var express = require('express');
require("babel-polyfill");
var app = express();
exports.app = app;
var bodyParser = require('body-parser');
var algoTools = require('./pathfinderAlgorithm');

var geojson = require('../json_files/corridors.json');


// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 8080;

/* ! Routes ! */
var router = express.Router();

// GET /
router.get('/', async function (req, res) {
    var localA = req.query.localA,
        localB = req.query.localB;
    var fullpath;
    var status;
    var error = undefined;

    try {
        fullpath = await algoTools.pathfind(localA, localB);
    } catch (e) { error = { message: "Can't find path with those locals" }; }
    if (error != undefined) {
        res.status(404).json({ message: error.message });
    }
    else { res.status(200).json({ fullPath: fullpath }); }
});

router.post('/corridors', function (req, res) {
    var corridors = req.body.map;
    var string = JSON.stringify(corridors, null, '\t');
    console.log(corridors);
    var fs = require('fs');
    fs.writeFile("./corridors.json", string, function (err) {
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
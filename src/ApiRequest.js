var https = require("https");
var fetch = require('node-fetch');


module.exports = {
    getFromAPI: async function(path){
        let response = await fetch(csfUrl+path, { headers: {'Authorization': 'Token token='+authToken }})
        return await response.json();
    }

}

let authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
let csfUrl = 'https://csf-geo-app.herokuapp.com';
var https = require("https");
var fetch = require('node-fetch');

const LOCAL_NOT_FOUND = "Un ou des locaux passés n'existent pas !";

module.exports = {
    getFromAPI: async function(path){
        try{
            let response = await fetch(csfUrl+path, { headers: {'Authorization': 'Token token='+authToken }})
            if(response != undefined){
                return await response.json();
            }
            else{
                throw new Error(LOCAL_NOT_FOUND);
            }
        }catch(e){ }
    }

}

let authToken = 'bfc6b6a7a48eb2841ff1090a53e22bed';
let csfUrl = 'https://csf-geo-app.herokuapp.com';
const express = require('express');
const ngrok = require('ngrok');
var bodyparser = require('body-parser');
//var admin = require ('firebase-admin');


const app = express();
const puerto = 3000;
var ip = process.env.IP || "127.0.0.1";

app.use(bodyparser.urlencoded({extends:false}));
app.use(bodyparser.json());

app.post('/',function(req,res){
    console.log("ingreso al endpoint");
    console.log(req.body);
});

app.listen(puerto,ip);

(async function(){
    const url=await ngrok.connect(puerto);
    console.log(url);
})();

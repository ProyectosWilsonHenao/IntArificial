const mobilnet =require('@tensorflow-models/mobilenet');
const tfnode =require('@tensorflow/tfjs-node');
const filesystem =require('fs');
const express =require("express");
var bodyParser =require("body-parser");
const app =express();
const puerto =3001;
const multer=require("multer");
const carga_folder=multer({dest: __dirname+"/carga/images"});
var admin =require("firebase-admin");

var cuentaDeServicio=require("./prediccionia-61f69-firebase-adminsdk-zug6o-e48a6ae54e.json");

admin.initializeApp({
    credential: admin.credential.cert(cuentaDeServicio),
    databaseURL: "https://prediccionia-61f69.firebaseio.com"
  });

const db = admin.firestore();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/cargar", carga_folder.single("fotografia"),async (req,res)=>{
    if(req.file){
        await clasificarimagen(req.file.path);
       res.json(req.file);
       db.collection("Historico_prediccion")
        .get()
        .then(snapshot => {
             if (snapshot.empty) {
                console.log('No matching documents.');
                return;
    }
          snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          });
        })
  .catch(err => {
    console.log('Error getting documents', err);
  });


    }else throw "error";
});

app.listen(puerto,()=>{
    console.log("se esta escuchando en el puerto :",puerto);
});

const leerimagen=(ruta)=>{
    const bufferimage = filesystem.readFileSync(ruta);
    const imagentf = tfnode.node.decodeImage(bufferimage);
    return imagentf;
};

const clasificarimagen = async(ruta)=>{
    const imagen = leerimagen(ruta);
    const modelomobile = await mobilnet.load();
    const prediccion = await modelomobile.classify(imagen);
    const data = {
        imagen_ruta: ruta,
        resultado_prediccion: JSON.stringify(prediccion).toString()
      };
    db.collection('Historico_prediccion')
    .doc()
    .set(data)
    .then(function(){
        console.log('el documento fue creado');
    }).catch((err)=>{
        console.log('ocurrio un error',err);
    });
    console.log('el resultado de la predicción es', prediccion);
}

/*if(process.argv.length !== 3)throw new Error("argumento es invalido");
clasificarimagen(process.argv[2]);*/
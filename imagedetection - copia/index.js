const mobilnet =require('@tensorflow-models/mobilenet');
const tfnode =require('@tensorflow/tfjs-node');
const filesystem =require('fs');

const leerimagen=(ruta)=>{
    const bufferimage = filesystem.readFileSync(ruta);
    const imagentf = tfnode.node.decodeImage(bufferimage);
    return imagentf;
};

const clasificarimagen = async(ruta)=>{
    const imagen = leerimagen(ruta);
    const modelomobile = await mobilnet.load();
    const prediccion = await modelomobile.classify(imagen);
    console.log('el resultado de la predicción es', prediccion);
}

if(process.argv.length !== 3)throw new Error("argumento es invalido");
clasificarimagen(process.argv[2]);
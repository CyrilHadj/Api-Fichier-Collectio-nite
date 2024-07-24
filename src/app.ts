const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileUpload");
const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(fileUpload());

app.post("/upload", async (req,res)=>{
    console.log(req.files);
    const image = req.files.image;

    if(image == undefined){
        res.status(400).json({msg : "No image sent by the client"})
        return;
    }

    const extensionFile = image.name.split(".")[1];
    const fileName = image.name.split(".")[0];
    const completeFileName = `${fileName}_${Date.now()}.${extensionFile}`;

    image.mv(`${__dirname}/public/${completeFileName}`)

    res.status(200).json({url : `http://localhost:8080/${completeFileName}`});
});

app.use((req,res)=>res.status(404).json({msg : "This route does not exists"}))

app.listen(8080, ()=>{
    console.log("server listen on port 8080")
})
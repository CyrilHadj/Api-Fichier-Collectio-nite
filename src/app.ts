const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileUpload");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use(fileUpload());

const fs = require("fs");
const path = require("path");

function normalizeFileName(fileName){
    return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "_"); 
}

app.delete("/delete", (request,reponse)=>{
   
    const imageUrl = request.body.url;
console.log(imageUrl)
    const fileName = decodeURIComponent(imageUrl.split("/").pop());

    const filePath = path.join(__dirname, "public", fileName);

    fs.access(filePath,fs.constants.F_OK,(error)=>{
        if(error){
            return reponse.status(404).json({msg : "file not found"})
        }

        fs.unlink(filePath,(error)=>{
            if(error){
                return reponse.status(500).json({msg : "Error when deleting the file"})
            }

            reponse.status(200).json({msg : "File has been deleted"})
        })
    })

})


app.post("/upload", async (req,res)=>{
    const image = req.files.image;
    console.log(req.files.image);

    if(image == undefined){
        res.status(400).json({msg : "No image sent by the client"})
        return;
    }

    const extensionFile = image.name.split(".")[1];
    const fileName = normalizeFileName(image.name.split(".")[0]);
    const completeFileName = `${fileName}_${Date.now()}.${extensionFile}`;

    image.mv(`${__dirname}/public/${completeFileName}`)

    const encodeUrl = encodeURIComponent(completeFileName)
    res.status(200).json(`http://localhost:8090/${completeFileName}`);
});

app.use((req,res)=>res.status(404).json({msg : "This route does not exists"}))

app.listen(8090, ()=>{
    console.log("server listen on port 8090")
})
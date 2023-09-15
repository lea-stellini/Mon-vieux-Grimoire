const sharp = require("sharp");
const fs = require('fs');

module.exports = (req, res, next) => {

    fs.access('./images', (error) => {
        if(error){
            fs.mkdirSync('./images');
        }
    });

    compressImg = () => {
        const timestamp = new Date().toISOString();
        const path = `${timestamp}-${req.file.originalname}.webp`;
            
        sharp(req.file.buffer)
            .webp({quality: 20})
            .toFile(`./images/${path}`);
                
        req.compressedFilename = path   
                
        next();
    }

    req.file ?  compressImg() : next()
}
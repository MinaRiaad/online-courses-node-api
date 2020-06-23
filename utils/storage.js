const multer = require("multer");
const { promisify } = require("util");
const fs = require("fs");
const config=require('config');
const path= require("path");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname,'..','public','media'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter =async function (req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|mp4)$/)) {
      req.valid=false;
      cb(null,false)
    }
    else
      cb(null,true)
    
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:fileFilter
});

function deleteFiles(files) {
    const unlinkAsync = promisify(fs.unlink);
    files.map(async(file)=>{
      await unlinkAsync(`${config.get('publicPath')}${file}`);
    })
}

module.exports.upload=upload;
module.exports.deleteFiles=deleteFiles;

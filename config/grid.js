//middleware for uploading and storing files

const crypto=require('crypto'); //to generate file names
const multer=require('multer');
const path= require('path');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const { mongoURI } = require('./database');

//create storage engine
const storage = new GridFsStorage({
    url:mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        //to generate 16 char names
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
  const upload = multer({
    storage
  });
  module.exports={storage:storage,upload:upload};
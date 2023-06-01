const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const Upload = require('../model/Upload');

const storage = new Storage({ keyFilename: '../coba-deploy-388006-64811a2ff4ab.json', projectId: 'coba-deploy-388006' });
const bucket = storage.bucket("grow-plants");

const uploadImage = (file, location) => new Promise((resolve, reject) => {
    const { originalname, buffer } = file
    
    const ext = originalname.split('.').pop();
    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "PNG" && ext !== "JPG" && ext !== "JPEG") {
      const response = new Response.Error(400, "Only images are allowed" );
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }
    
    let fileName = originalname.replace(/ /g, "_").split('.');
    fileName = fileName[0] + '-' + Date.now() + '.' + fileName[1];
  
    const blob = bucket.file(location + fileName)
    const blobStream = blob.createWriteStream({
      resumable: false
    })
    blobStream.on('finish', async () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      ) 
  
      const upload = new Upload({
          url: publicUrl,
          name: originalname.replace(/ /g, "_"),
      });
  
      await upload.save();
      resolve(upload)
    })
    .on('error', (error) => {
      reject(`Unable to upload image, something went wrong`)
    })
    .end(buffer)
  })

  module.exports = uploadImage
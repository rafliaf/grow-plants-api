const Upload = require('../model/Upload');
const processFile = require("../middleware/uploadArticleFile");
const httpStatus = require("http-status");
const Response = require("../model/Response");
const path = require('path');
const uploadImage = require('../utils/upload')

const postUpload = async (req, res) => {
    let response = null;
    try{
        await processFile(req, res);
    
        if (!req.file) {
          const response = new Response.Error(400, "Please upload a image!" );
          return res.status(httpStatus.BAD_REQUEST).json(response);
        }

        const upload = await uploadImage(req.file, "img/")
        response = new Response.Success(false, "Upload Success", upload);
        res.status(httpStatus.OK).json(response);

      } catch (error) {
      response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getUploads = async (req, res) => {
  let response = null;
  try{
    const images = await Upload.find();

    response = new Response.Success(false, null, images);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteUpload = async (req, res) => {
  let response = null;
  try {
    // cloud storage delete image
    const findImg = await Upload.findOne({
      _id: req.query.id,
    });
    const ext = path.extname(findImg.url);
    const findName = findImg.name;
    const fileName = findName + "" + ext;
    const blob = bucket.file("img/" + fileName.toLowerCase().split(" ").join("-"));
    const deleted = await blob.delete();

    console.log(`gs://${bucket.name}/${blob.name} deleted`);

    // mongodb delete data
    const deleteImg = await Upload.findByIdAndDelete(req.query.id);
    if(!deleteImg) {
      response = new Response.Error(true, notFoundId);
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }
    response = `Detele ${blob.name} Success!`;
    res.status(httpStatus.OK).json({ message: response});
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}

module.exports = { postUpload, getUploads, deleteUpload };

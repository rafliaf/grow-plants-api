const axios = require('axios');
const FormData = require('form-data');
const Response = require("../model/Response");
const httpStatus = require("http-status");
const processFile = require("../middleware/uploadArticleFile");
const uploadImage = require('../utils/upload');
const DiseaseCategories = require('../constant/disease_categories');
const Article = require('../model/Article');
const History = require('../model/History');

const predictController = async (req, res) => {
  let response = null;
    try {
      await processFile(req, res);
    
      if (!req.file) {
        const response = new Response.Error(400, "Please upload a image!" );
        return res.status(httpStatus.BAD_REQUEST).json(response);
      }

      const ext = req.file.originalname.split('.').pop();
      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "JPG" && ext !== "JPEG" ) {
        const response = new Response.Error(400, "Only images with extension jpg or jpeg are allowed" );
        return res.status(httpStatus.BAD_REQUEST).json(response);
      }

      let fileName = req.file.originalname.replace(/ /g, "_").split('.');
      fileName = fileName[0] + '-' + Date.now() + '.' + fileName[1];

      var bodyFormData = new FormData();
      bodyFormData.append('file', req.file.buffer, { filename : fileName});

      const mlResponse = await axios.post("http://localhost:8000/predict", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })  
      const diseaseIdx = mlResponse.data.predicted
      const predictResults = mlResponse.data.detail[0];
      //console.log(diseaseIdx);

      //console.log(DiseaseCategories[diseaseIdx])
      const articles = await Article.find({category : DiseaseCategories[diseaseIdx]})
      let articleIds = []
      articles.forEach((data) => {
        articleIds.push(data._id);
      })

      const upload = await uploadImage(req.file, "ml-img/")

      //console.log(predictResults)
      const history = new History({
        userId: req.currentUser._id,
        email: req.currentUser.email,
        imageUrl: upload.url,
        articleIds : articleIds,
        predictRate: predictResults[diseaseIdx],
      });

      await history.save();

      response = new Response.Success(false, "Upload Success", {
        predicted_disease : DiseaseCategories[diseaseIdx],
        articles : articles
      });
      res.status(httpStatus.OK).json(response);
    } catch (error) {
        //console.log(error)
        response = new Response.Error(true, error.message);
        res.status(httpStatus.BAD_REQUEST).json(response);
    }
}


module.exports = {
   predictController
}
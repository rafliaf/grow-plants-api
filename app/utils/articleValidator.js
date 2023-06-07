const Joi = require("joi");
const DiseaseCategories = require("../constant/disease_categories");

const articleValidator = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid(...DiseaseCategories).required(),
  description: Joi.string().required(),
  prescription : Joi.string().required(),
  prevention : Joi.string().required()
});

module.exports = articleValidator;

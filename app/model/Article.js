const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  prescription: {
    type: [String],
    required: true,
  },

  prevention: {
    type: [String],
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

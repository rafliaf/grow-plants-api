const Response = require("../model/Response");
const User = require("../model/User");
const UserImages = require("../model/UserImages");
const httpStatus = require("http-status");
const processFile = require("../middleware/uploadFile");
const uploadImage = require('../utils/upload')

const getUser = async (req, res) => {
  const user = req.currentUser;
  const response = new Response.Success(false, null, user);
  res.json(response);
};

const updateUser = async (req, res) => {
  try {    
    const userId = req.currentUser._id;
    const userEmail = req.currentUser.email;

    await processFile(req, res);
    
    if (!req.file) {
      const response = new Response.Error(400, "Please upload a image!" );
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }

    const result = await uploadImage(req.file, "user-img/");

    const upload = new UserImages({
        userId: userId,
        email: userEmail,
        imageUrl: result.url,
    });
    const uploadSave = await upload.save();

    // Update user profiles images
    await User.findByIdAndUpdate(userId, { imageUrl: result.url } );

    // Return response
    const response = new Response.Success(false, null, uploadSave);
    res.status(httpStatus.OK).json(response);

  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = { getUser, updateUser };

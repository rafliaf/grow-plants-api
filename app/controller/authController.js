const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const Response = require("../model/Response");
const bcrypt = require("../utils/bcrypt");

const User = require("../model/User");
const userValidator = require("../utils/userValidator");
const signInValidator = require("../utils/signInValidator");

// Sign Up (daftar user)
const signUp = async (req, res) => {
  let response = null;
  try {
    const request = await userValidator.validateAsync(req.body);

    const users = await User.findOne({ email: request.email });
    if (users) {
      response = new Response.Error(true, "Email sudah digunakan");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const hashedPassword = await bcrypt.hash(request.password);
    request.password = hashedPassword;

    const user = new User(request);
    user.imageUrl = "https://storage.googleapis.com/grow-plants/profile-default/profile.png";

    const result = await user.save();
    response = new Response.Success(false, null, result);
    res.status(httpStatus.OK).json(response);

  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

// Sign In (login user)
const signIn = async (req, res) => {
  let response = null;
  const errorMessage = "Email atau password salah!";
  try {
    const request = await signInValidator.validateAsync(req.body);

    const user = await User.findOne({ email: request.email });
    if (!user) {
      response = new Response.Error(true, errorMessage);
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const validPassword = await bcrypt.compare(
      request.password,
      user.password
    );
    if (!validPassword) {
      response = new Response.Error(true, signInErrorMessage);
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const createToken = jwt.sign({ id: user._id }, process.env.KEY);
    const data = { token: createToken };
    response = new Response.Success(false, null, data);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = { signUp, signIn };

const {
  validateGetUserQuery,
  validateIdParam,
  validatePostUserRequest,
  validateUpdateUserRequest,
  validateSignInRequest,
} = require("../validations/validation");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
async function signUpUser(req, res) {
  try {
    const { error, value } = validatePostUserRequest.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid Request", error: error.details });
    }

    const { username } = value;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Assign the default role during user creation
    const newUser = await User.create({ ...value, role: "user" });

    // Generate JWT token for the newly registered user
    const accessToken = authMiddleware.generateAccessToken(newUser);

    // Avoid sending sensitive information in the response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    };

    res.status(201).json({
      message: "User created successfully",
      data: userResponse,
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function signInUser(req, res) {
  try {
    const { error, value } = validateSignInRequest.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid Request", error: error.details });
    }
    const { email, password } = value;

    const user = await User.findOne({ email });
    // console.log(user);

    // // Log the stored hashed password
    // console.log(
    //   "Stored Hashed Password:",
    //   user ? user.password : "User not found"
    // );

    // // Log the entered password from the request
    // console.log("Entered Password:", password);

    // console.log(await bcrypt.compare(password, user ? user.password : ""));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for the signed-in user
    const accessToken = authMiddleware.generateAccessToken(user);

    res.json({ message: "Sign-in successful", token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { signUpUser, signInUser };

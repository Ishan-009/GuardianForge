// Importing Model

const User = require("../models/userModel");

// Importing Moongoose

const mongoose = require("mongoose");

// Importing All Joi Validations

const {
  validateGetUserQuery,
  validateIdParam,
  validatePostUserRequest,
  validateUpdateUserRequest,
} = require("../validations/validation");

// Step 6: Routing & Logic

// POST Create User

async function createUser(req, res) {
  const newUser = req.body;
  try {
    // Validate User Body

    const { error, value } = validatePostUserRequest.validate(req.body);

    if (error) {
      res
        .status(400)
        .json({ message: "Invalid Request", error: error.details });
      return;
    }

    const { username, email } = value;
    console.log(username);
    console.log(email);
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    }); // it filters the search criteria and apply search on username or email and finds one user

    // Check for existing User to avoid duplication
    if (existingUser) {
      res.status(409).json({ message: "Username or Email Already Existed" });
      return;
    }

    // we are creating hashed password for every user in above line, before saving user
    const user = await User.create(value);

    if (user) {
      res.status(201).json({ data: user });
      return;
    }
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid user data", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Users with Filter and Validation

async function getUsers(req, res) {
  const query = req.query; // optional pagination and filtering
  try {
    const { error, value } = validateGetUserQuery.validate(
      req.query || req.body
    );

    if (error)
      return res
        .status(400)
        .json({ message: "Invalid query parameters", error: error.details });

    // assigning page and page size value from value variable
    const { page = 1, page_size = 2, username, email } = value;

    const skip = (page - 1) * page_size;

    //Assigning User Defined Filters to the variable
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;

    const users = await User.find(filter)
      .skip(skip)
      .limit(page_size)
      .select("-password") // exclude password
      .lean(); // Customize data result with filer,  limit and skip

    const totalUsers = await User.countDocuments(filter);
    // Custom Response
    const response = {
      message: "User Data",
      data: users,
      pagination: { page, page_size },
      totalUsers: totalUsers,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get User BY ID:-

async function getUserById(req, res) {
  try {
    // Validate User Param
    const { error, value } = validateIdParam.validate(req.params);

    if (error) return res.status(400).json({ message: "Invalid User ID" });

    const { id } = value;
    console.log(id);

    // Fetch User by Id

    const user = await User.findById(id).select("-password").lean();

    // check for user not found
    if (!user) {
      return res.status(404).json({ message: "User with given Id not found" });
    }
    return res
      .status(201)
      .json({ message: "User Data with the given ID", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update User PUT

async function updateUser(req, res) {
  try {
    // Validate ID parameter
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate User Body
    const { error, value } = validateUpdateUserRequest.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: "Invalid Request", error: error.details });

    // Check for existing User
    const user = await User.findByIdAndUpdate(id, value, { new: true }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Updated User Details", data: user });
  } catch (error) {
    // Handle other errors here
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteUser(req, res) {
  try {
    // Retrieve Id
    const { id } = req.params;

    // Check if Id is valid or not

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID is Invalid" });
    }

    // Check user existence

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "UserId not Found" });
    }

    return res
      .status(201)
      .json({ message: "User with given Id is deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
 
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};

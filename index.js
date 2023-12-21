const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

const Joi = require("joi");

// Importing config file

const config = require("./config/config.js");

// Importing DB File and connecting to the database
const { connectToDatabase } = require("./utils/databaseUtils.js");
connectToDatabase();

// Middleware

app.use(express.json());

//Auth Routes
const authRoutes = require("./routes/authRoutes.js");
app.use("", authRoutes);

// User Routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/users", userRoutes);

// Error Handling
const errorMiddleware = require("./middleware/errorMiddleware.js");
app.use(errorMiddleware);

// // Create Admin User

// const createAdminUser = require("./utils/explicitCreateAdmin.js");
// createAdminUser();

// Last Step:- Enable application to listen on port
app.listen(port, () => console.log(`Server listening on port ${port}`));

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/signup", authController.signUpUser);
router.post("/signin", authController.signInUser);

module.exports = router;

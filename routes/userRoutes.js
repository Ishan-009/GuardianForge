const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authorizeRoles = require("../middleware/authorizeMiddleware"); // Import the module
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/create",
  authMiddleware.authenticateUser,
  userController.createUser
);
router.get("/", authMiddleware.authenticateUser, userController.getUsers);
router.get("/:id", authMiddleware.authenticateUser, userController.getUserById);
router.put(
  "/update/:id",
  authMiddleware.authenticateUser,
  authorizeRoles(["admin"]),
  userController.updateUser
);

router.delete(
  "/delete/:id",
  authMiddleware.authenticateUser,
  authorizeRoles(["admin"]),
  userController.deleteUser
);

module.exports = router;

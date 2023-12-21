const jwt = require("jsonwebtoken");
const config = require("../config/config");

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user._id, username: user.username, role: user.role }, // Include 'role'
    config.JWT_SECRET,
    {
      expiresIn: "20m", // Adjust as needed
    }
  );
}

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized or Unauthenticated" });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

exports.generateAccessToken = generateAccessToken;

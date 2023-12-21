// Global Error Catcher
function errorMiddleware(err, req, res, next) {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  } else if (err instanceof mongoose.Error) {
    res.status(500).json({ error: "Mongoose Error" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = errorMiddleware;

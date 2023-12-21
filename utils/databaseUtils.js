//

const mongoose = require("mongoose");
const config = require("../config/config");

async function connectToDatabase() {
  mongoose
    .connect(config.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1); // Exit the application if there's an error in connecting
    });
}

exports.connectToDatabase = connectToDatabase;

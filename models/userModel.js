const mongoose = require("mongoose");

// For password hashing
const bcrypt = require("bcrypt");

// Creating User Schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // index:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      // select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Step 3: Password Hashing
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Step 4 :- Indexes for efficiency

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Step 5: Creating User Model by filling up with User Schema

const User = mongoose.model("User", userSchema);

module.exports = User;

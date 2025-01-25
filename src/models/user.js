const mongoose = require("mongoose");

// Step 1: Create schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [40, "First name cannot exceed 40 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [40, "Last name cannot exceed 40 characters"],
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Email regex
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          // At least one uppercase letter, one lowercase letter, one number, and one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    age: {
      type: Number,
      trim: true,
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
    },
    gender: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return ["male", "female", "others"].includes(value);
        },
        message: "Gender must be one of the following: male, female, others",
      },
    },
  },
  { timestamps: true }
);

// Step 2: Define a new model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

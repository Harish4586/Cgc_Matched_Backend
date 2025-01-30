const mongoose = require("mongoose");
const validator=require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// Step 1: Create schema
const userSchema =new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [40, "First name cannot exceed 40 characters"],
      validate(value){
        if(!validator.isAlpha(value, 'en-US', { ignore: ' -\'' })){
          throw new Error("First name can only contain letters, spaces, hyphens, or apostrophes");
        }
      }
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [40, "Last name cannot exceed 40 characters"],
      validate(value){
        if(!validator.isAlpha(value, 'en-US', { ignore: ' -\'' })){
          throw new Error("Last name can only contain letters, spaces, hyphens, or apostrophes");
        }
      }
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if(!validator.isEmail(value)){
          throw new Error("Invalid email format");
        }
        // message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate(value) {
        if(!validator.isStrongPassword(value)){
          throw new Error("Invalid password format");
        }
        
      },
    },
    age: {
      type: Number,
      trim: true,
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
      validate(age) {
        // Ensure age is a valid number and falls within a specific range (e.g., 18 to 100)
        if (!Number.isInteger(age) || age < 18 || age > 100) {
          throw new Error("Age must be an integer between 18 and 100");
        }
      }
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
//using jsonwebtoken library
      //creating a token for every user by passing id of user and a private key
userSchema.methods.getJWT= async function() {
  const token= await jwt.sign({_id:this._id},"Harsh@123$123",{expiresIn:"10d"}); 
  return token;
};
userSchema.methods.isValidPassword= async function(passwordInputBYUser){
      const isValidPassword = await bcrypt.compare(passwordInputBYUser, this.password);
      return isValidPassword;
  
}

// Step 2: Define a new model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

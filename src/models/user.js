const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [40, "First name cannot exceed 40 characters"],
      validate(value) {
        if (!validator.isAlpha(value, 'en-US', { ignore: ' -\'' })) {
          throw new Error("First name can only contain letters, spaces, hyphens, or apostrophes");
        }
      }
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [40, "Last name cannot exceed 40 characters"],
      validate(value) {
        if (!validator.isAlpha(value, 'en-US', { ignore: ' -\'' })) {
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
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
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
        if (!Number.isInteger(age) || age < 18 || age > 100) {
          throw new Error("Age must be an integer between 18 and 100");
        }
      }
    },
    gender: {
      type: String,
      trim: true,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender!!`
      }
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
      validate(value) {
        if (!Array.isArray(value) || value.some(skill => typeof skill !== "string")) {
          throw new Error("Skills must be an array of strings");
        }
      },
      default: ["Cgcian"]
    }
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const token = jwt.sign({ _id: this._id }, "Harsh@123$123", { expiresIn: "10d" });
  return token;
};

userSchema.methods.isValidPassword = async function (passwordInputBYUser) {
  return await bcrypt.compare(passwordInputBYUser, this.password);
};

userSchema.index({ firstName: 1, lastName: 1 });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;


const Joi= require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const express= require("express");

const ValidateSignUp = async (req) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(40)
      .required()
      .trim()
      .pattern(/^[A-Za-z\s\-']+$/)
      .messages({
        "string.pattern.base":
          "First name can only contain letters, spaces, hyphens, or apostrophes",
      }),

    lastName: Joi.string()
      .max(40)
      .optional()
      .trim()
      .pattern(/^[A-Za-z\s\-']+$/)
      .messages({
        "string.pattern.base":
          "Last name can only contain letters, spaces, hyphens, or apostrophes",
      }),

    emailId: Joi.string().email().required().trim().lowercase(),

    password: Joi.string()
      .min(8)
      .required()
      .trim()
      .messages({
        "string.min": "Password must be at least 8 characters long",
      }),

    age: Joi.number()
      .integer()
      .min(18)
      .max(100)
      .optional()
      .messages({
        "number.min": "Age must be at least 18",
        "number.max": "Age cannot exceed 100",
      }),

    gender: Joi.string().valid("male", "female", "others").optional(),

    isPremium: Joi.boolean().optional(),

    membershipType: Joi.string().valid("free", "premium", "VIP").optional(),

    photoUrl: Joi.string().uri().optional().messages({
      "string.uri": "Invalid Photo URL",
    }),

    about: Joi.string().optional().default("This is a default about of the user!"),

    skills: Joi.array().items(Joi.string()).optional().default([]),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Hash the password before returning
  const hashPassword = await bcrypt.hash(value.password, 10);

  return { ...value, password: hashPassword };
};


const ValidatePutApi = (req) => {
  const schema = Joi.object({
    lastName: Joi.string()
      .max(40)
      .optional()
      .trim()
      .pattern(/^[A-Za-z\s\-']+$/)
      .messages({
        "string.pattern.base":
          "Last name can only contain letters, spaces, hyphens, or apostrophes",
      }),

    gender: Joi.string().valid("male", "female", "others").optional(),

    age: Joi.number().integer().min(18).max(100).optional(),

    password: Joi.string().min(8).optional(),

    photoUrl: Joi.string().uri().optional().messages({
      "string.uri": "Invalid Photo URL",
    }),

    about: Joi.string().optional(),

    skills: Joi.array().items(Joi.string()).optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }

  return value;
};


const ValidataLogin = async (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("Email and password are required!");
  }

  // Find user by email
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new Error("User not found! Please check the email.");
  }

  // Verify password
  const isValidPassword = await user.isValidPassword(password);
  if (!isValidPassword) {
    throw new Error("Invalid password!!");
  }

  // Generate JWT token
  const token = await user.getJWT();

  return {
    userId: user._id,
    emailId,
    firstName: user.firstName,
    lastName: user.lastName,
    token,
  };
};

  

module.exports={
    ValidateSignUp,ValidatePutApi,ValidataLogin
};
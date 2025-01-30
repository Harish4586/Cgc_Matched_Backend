
const Joi= require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const ValidateSignUp= async (req)=>{

const schema = Joi.object({
    firstName: Joi.string().min(2).max(40).required().trim(),
    lastName: Joi.string().optional().trim(),
    emailId: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().min(6).required().trim(),
    age: Joi.number().min(18).max(100).optional(),
    gender: Joi.string().valid("male", "female", "others").required(),
  });
  const {error,value}= schema.validate(req.body);//validate req.body according to defined schema
  if(error){throw new Error("error while signing up in validation!!!")};
    // Hash the password
    const hashPassword = await bcrypt.hash(value.password, 10); // 10 is the salt rounds
    const { firstName, lastName, emailId, age, gender } = value;
    
  
    return { firstName, lastName, emailId, age, gender, password: hashPassword };

};

const ValidatePutApi=(req)=>{
     const schema = Joi.object({
        lastName: Joi.string().optional(),
        gender: Joi.string().valid("male", "female", "others").optional(),
        age: Joi.number().min(18).max(100).optional(),
        password: Joi.string().optional(),
      });
    
      // Validate request body
      const { error, value } = schema.validate(req.body);
      if (error) {
        throw new Error("error in validating put api !!!");
      }
     return value;
};

const ValidataLogin = async (req) => {
    const { emailId, password } = req.body;
    // console.log(req.body);
  
    // Check if emailId and password are provided
    if (!emailId || !password) {
      throw new Error("Email and password are required!");
    }
  
    // Find user by email
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("User not found! Please check the email.");
    }
    
    const token = await user.getJWT();
  
    // Compare password with the stored hash
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid password!");
    }
  
    // Return validated user details
    return {userId:user._id, emailId, firstName: user.firstName, lastName: user.lastName,token };
  };
  

module.exports={
    ValidateSignUp,ValidatePutApi,ValidataLogin
};
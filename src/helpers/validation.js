
const Joi= require("joi");
const bcrypt = require("bcrypt");

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
        emailId: Joi.string().email().required(),
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

module.exports={
    ValidateSignUp,ValidatePutApi
};
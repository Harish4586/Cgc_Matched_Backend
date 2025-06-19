const express = require("express");
const User = require("../models/user");
const {
  ValidateSignUp,
  ValidataLogin,
  ValidatePutApi,
} = require("../helpers/validation");

const authRouter = express.Router();

// api to create a new user
authRouter.post("/signup", async (req, res) => {
  // Define the validation schema for the user

  try {
    const value = await ValidateSignUp(req); //the validate fn will always return promise and we have to use await to resolve
    // Create a new user instance using the validated data
    // console.log(",getting value",value);
    const user = new User(value);
    const { emailId } = value;

    // Save the user to the database
    await user.save();
    const token = await user.getJWT();
    // console.log(token);
    res.cookie("token", token, { maxAge: 3600000 * 24 * 10 });

    res.json({data:user});
  } catch (err) {
    res
      .status(400)
      .send({ error: "Error saving user data", details: err.message });
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    // Validate login data
    const userData = await ValidataLogin(req); //we can login any user with email and password here through req body
    // const userData= req.user; //we can only validate the user with cookie here!!
    if (!userData) {
      throw new Error("user not found");
    }

    //  const token= jwt.sign({_id:userData.userId},"Harsh@123$123",{expiresIn:"10d"});
    const { token } = userData;
    //  console.log(token);
    //sending cookie to browser
    res.cookie("token", token, { maxAge: 900000 });
    // Send success response
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: userData,
    });
  } catch (err) {
    // Send error response
    res.status(400).send({
      success: false,
      message: "Unable to login",
      error: err.message,
    });
  }
});

//logout api
authRouter.post("/logout", async (req, res) => {

try { 
//     const cookiee= req.cookies;
//     const {token}= cookiee;
//     const decodedMessage = await jwt.verify(token,"Harsh@123$123");
//     const {_id}= decodedMessage;
//     const user= await User.findById({_id});
//     if(!user){throw new Error("user not found")}
//      res.cookie("token", null, { expires: new Date(Date.now()) });
//   res.send("logout successfully: "+user.firstName);

//btw there is no harm to let the user logout without knowing if he is logged in or not!
res.cookie("token", null, { expires: new Date(Date.now()) });
res.send("logout successfully: ");
}
  catch(err){
    res.status(400).send("error occured while logging out!!!"+err);
  }
});

module.exports = authRouter;

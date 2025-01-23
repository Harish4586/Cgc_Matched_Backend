const express = require("express");
const app = express();
const{adminAuth,userAuth}= require("./middleWare/auth");
require("./config/database");
const dbConnect=require("./config/database");
const User= require("./models/user");


app.post("/signup", async (req,res)=>{
  const UserObj={
    firstName:"avni",
    lastName:"jain",
    emailId:"avni@jain.com",
    password:"avni@123",
    age:22,
    gender:"female"
  }
  //creating a new instance of the user model by passing UserObj 

  const user=new User(UserObj);
   //now this user.save fn will be returning a promise so we'll make the whole post fn as async await

   //and also we can use try catch block to handle erros
   try{
    await user.save();
   res.send("user data saved successfully");
   } catch(err){
    res.status(400).send("error occured");
   }
})


dbConnect().then(()=>{
  console.log("databse connected successfully");
  app.listen(1000, () =>
    console.log("listening successfully on port number 1000 ")
  );
  }).catch((err)=>{
    console.error("database didn't connect");
  });





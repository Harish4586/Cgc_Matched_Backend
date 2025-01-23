const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middleWare/auth");
require("./config/database");
const dbConnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());//convert incoming req.body into proper format

app.post("/signup", async (req, res) => {
  // const UserObj={
  //   firstName:"avni",
  //   lastName:"jain",
  //   emailId:"avni@jain.com",
  //   password:"avni@123",
  //   age:22,
  //   gender:"female"
  // }
  //creating a new instance of the user model by passing UserObj

  // const user=new User(UserObj);
  const user2= new User(req.body);
  // now this user.save fn will be returning a promise so we'll make the whole post fn as async await

  //and also we can use try catch block to handle erros
   try{
    await user2.save();
   res.send("user data saved successfully");
   } catch(err){
    res.status(400).send("error occured");
   }

  // console.log(req.body); //this will not come in json format so we use express .json() in app.use so that it can be used widely
});

//api to get a user by passing email id

app.get("/getUser", async(req,res)=>{
  const userEmail= req.body.emailId;
  try{
    const users= await User.find({emailId:userEmail});
    if(users.length!=0){res.send(users);}
    else{
      res.status(404).send("oops! user not found..");
    }

  }
  catch{
    res.status(400).send("error encounterd");
  }
});

//api to get all the users-feed Api
app.get("/feed",async(req,res)=>{
  try{
    const users= await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send("something went wrong");
  }
})

dbConnect()
  .then(() => {
    console.log("databse connected successfully");
    app.listen(1000, () =>
      console.log("listening successfully on port number 1000 ")
    );
  })
  .catch((err) => {
    console.error("database didn't connect");
  });

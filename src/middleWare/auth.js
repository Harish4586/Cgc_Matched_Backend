const jwt = require("jsonwebtoken");
const User= require("../models/user");

const adminAuth= async (req,res,next)=>{
    try{  const cookiee = req.cookies;
        const {token}= cookiee;
        //validate the token
        const decodedObj= await jwt.verify(token,"Harsh@123$123");
        const {_id}= decodedObj;
        //finding and authenticating user here
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found!!!");
        }
        console.log("user is: ",user);
        next();
    }
    catch(err){
        res.status(404).send("user not found"+err);
    }
}
const userAuth=  async (req,res,next)=>{
    //recieving cookies and extracting token here
  try{  const cookiee = req.cookies;
    const {token}= cookiee;
    if(!token){throw new Error("token is not valid!!")}
    //validate the token
    const decodedObj= await jwt.verify(token,"Harsh@123$123");
    const {_id}= decodedObj;
    //finding and authenticating user here
    const user = await User.findById(_id);
    if(!user){
        throw new Error("user not found!!!");
    }
    // console.log("user is: ",user);
    req.user=user;//passing user from here to avoid searaching again in next handlers

    next();
}
catch(err){
    res.status(404).send("user not found"+err);
}

}

module.exports={adminAuth,userAuth};
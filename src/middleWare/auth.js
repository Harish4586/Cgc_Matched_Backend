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


const userAuth = async (req, res, next) => {
    try {
      const { token } = req.cookies;
      
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
  
      const decodedObj = jwt.verify(token, "Harsh@123$123");
      const user = await User.findById(decodedObj._id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      req.user = user; // Attach user to request
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

module.exports={adminAuth,userAuth};
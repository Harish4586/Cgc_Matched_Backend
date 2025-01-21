const express = require("express");
const app = express();

// using next() to switch to the next route handler by calling it in first route handler

app.use("/user",(req,res,next)=>{
  console.log("handler 1"); 
  res.send("res 1 !!");
  next();    //refers to the next route handler (handler 2)
},(req,res)=>{ 
  console.log("handler 2"); 
  res.send("res 2!!");
});  

//we can also use an array to wrap route handlers
// app.use("/route",[routehandler1,routehandler2,routehandler3,routehandler4,routehandler5]);
//or
// app.use("/route",[routehandler1,routehandler2],routehandler3,routehandler4,routehandler5);


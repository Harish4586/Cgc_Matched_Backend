const express = require("express");
const app = express();
  //this type of error willl show unnessary details
// app.use("/",(req,res)=>{
//     throw new error("busted!!");
//     res.send("data sent successfully");
// });

//so we use-> try_catch

// app.use("/",(req,res)=>{
//     try{
//         throw new error("busted!!");
//     res.send("data sent successfully");
//     }
//     catch(err){
//      res.status(500).send("new error occured!");
//     }
// });

//or we can use->  best way to handle errors
app.use("/getUserData",(req,res)=>{
    throw new error("busted!!");
    // res.send("data sent successfully");
});

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("error encounterd");
    }
    res.send("data sent successfully");
})



app.listen(2000,()=>{
    console.log("listening!!");
});
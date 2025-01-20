const express= require("express");
const app= express();
// console.log("new project");

app.get((req,res)=>{
    res.send("namaste from homepage");
});
app.get("/login",(req,res)=>{
    res.send("hello from login");
});
app.get("/test",(req,res)=>{
    res.send("hello from test");
});

app.listen(1000,()=>console.log("listening successfully on port number 1000 "));

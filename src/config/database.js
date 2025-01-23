const mongoose= require("mongoose");


//it returns a promise that's why we use asyc await to properly handle this connection
// mongoose.connect("mongodb+srv://harishnirbaan2000:DaaP6tZ9qRzAfWSY@cluster0.tjzus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const dbConnect= async ()=>{
    mongoose.connect(
        "mongodb+srv://harishnirbaan2000:DaaP6tZ9qRzAfWSY@cluster0.tjzus.mongodb.net/CgcMatched");

};
//this is not the best way to connect with the databse because server is started first 
//and after that database is connected to application
//so we export dbconnect to app.js then we execute it 

// dbConnect().then(()=>{
// console.log("databse connected successfully");
// }).catch((err)=>{
//   console.error("database didn't connect");
// });


module.exports=dbConnect;



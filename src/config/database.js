const mongoose= require("mongoose");
const {CONNECTION_STRING}= require("../utils/constants");


//it returns a promise that's why we use asyc await to properly handle this connection
// mongoose.connect(CONNECTION_STRING);

const dbConnect= async ()=>{
    mongoose.connect(
        CONNECTION_STRING);

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



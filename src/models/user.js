const mongoose= require("mongoose");

//step1: create schema
const userSchema= mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type : String
    },
    password:{
        type : String
    },
    age :{
        type : Number
    },
    gender : {
        type : String
    }
});

// step 2: now we'll be defining a new model

const UserModel= mongoose.model("User",userSchema);
module.exports=UserModel;

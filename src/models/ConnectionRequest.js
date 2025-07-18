const { string, required } = require("joi");
const mongoose= require("mongoose");


const ConnectionSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",   //reference to user collection to populate recieved connectionRequests
    }
    ,toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accept","reject"],
            message:`{VALUE} is not valid...`
        }
    }
},{ timestamps:true }
);
const ConnectionRequestModel= new mongoose.model("ConnectionRequest", ConnectionSchema);

//Compound index: this is used to find a query faster when query is done on two fields of schema
ConnectionSchema.index({fromUserId:1,toUserId:1});

//could not understand

// ConnectionSchema.pre('save',function(next){
//     const ConnectionRequest= this;
//     if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId) ){
//         return next(new Error("You can't send a connection request to yourself"));
//     }
//     next();

// });




//note : a model name always starts with capital letter eg:ConnectionRequest
module.exports= ConnectionRequestModel;


const adminAuth= (req,res,next)=>{
    const token="xyz";
    const isAutherized= (token=="xyz");
    if(!isAutherized){
        console.log("authentication failed");
        res.send("unautherized user!!!");
    }
    next();
}
const userAuth= (req,res,next)=>{
    const token="xyz";
    const isAutherized= (token=="xyz");
    if(!isAutherized){
        console.log("authentication failed");
        res.send("unautherized user!!!");
    }
    next();
}

module.exports={adminAuth,userAuth};
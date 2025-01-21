const express = require("express");
const app = express();
// console.log("new project");

//this will listen to all http requests whether they are get or post etc.....

// app.use("/",(req,res)=>{
//     res.send("namaste from homepage");
// });

// but the app.get will only listen to http get request
app.get("/", (req, res) => {
  res.send("namaste from homepage");
});

// app.use("/user",(req,res)=>{ 
//         res.send("namaste from homepage");
// });    

//our router will not listen to any http request if we use {app.use("/user"),()=>{}} it here rather then
//we'll use it after all the get ,post,patch ,delete requset of the user
//so that when it is accessed sequentially , it encounters at the last


app.get("/user", (req, res) => {
    
  res.send({ name: "harsh", course: "btech",userId:req.query.userId });
});
app.post("/user", (req, res) => {
  res.send("data sent successfully to the db");
});
app.delete("/user", (req, res) => {
  res.send("deleted successfully!");
});

app.listen(1000, () =>
  console.log("listening successfully on port number 1000 ")
);

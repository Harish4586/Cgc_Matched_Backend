//this will listen to all http requests whether they are get or post etc.....

// app.use("/",(req,res)=>{
//     res.send("namaste from homepage");
// });

// but the app.get will only listen to http get request
app.get("/", (req, res) => {
  res.send("namaste from homepage");
});

//our router will not listen to any http request if we use {app.use("/user"),()=>{}} it here rather then
//we'll use it after all the get ,post,patch ,delete requset of the user
//so that when it is accessed sequentially , it encounters at the last


app.get("/user",userAuth, (req, res) => {
    
  res.send({ name: "harsh", course: "btech",userId:req.query.userId });
});
app.get("/user/:userId/:name",userAuth, (req, res) => {
    
  res.send({ name: req.params.name,userId:req.params.userId });
});
app.post("/user", userAuth, (req, res) => {
  res.send("data sent successfully to the db");
});
app.delete("/user",userAuth, (req, res) => {
  res.send("deleted successfully!");
});



app.get("/admin/user",adminAuth,(req,res)=>{
  res.send("data sent successfully")
});
app.delete("/admin/user",adminAuth,(req,res)=>{
  res.send("data deleted successfully")
});
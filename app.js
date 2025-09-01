const express = require("express");
const app = express();
const mongoose = require("mongoose");

main().then(()=>{
    console.log("coonected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/",(req,res)=>{
    console.log("i am here");
})
app.listen(8080,()=>{
    console.log("server listenning to 8080");
})
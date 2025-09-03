const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));


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
});
//delete
app.delete("/listings/:id",async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
//update
app.put("/listings/:id", async(req,res)=>{
let {id} = req.params;
console.log(req.body);
console.log({...req.body.listing})
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});
 app.post("/listings",async (req,res)=>{
  const newlisting= new Listing(req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect("/listings");

});
//create route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")

});

app.get("/listings/:id" ,async(req,res)=>{
let {id}  =req.params;
let mylist = await Listing.findById(id);
res.render("listings/show.ejs",{mylist});
});
app.get("/listings",async(req,res)=>{
  const alllist =  await Listing.find({});
    res.render("listings/index.ejs",{alllist});
});
app.listen(8080,()=>{
    console.log("server listenning to 8080");
});
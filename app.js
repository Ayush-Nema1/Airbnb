const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const engine = require('ejs-mate');
const wrapAsyn = require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const Joi = require("joi");
const {listingSchema} = require("./schema.js");


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use (express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("coonected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const validateListing=(req,res,next)=>{
 let {error} = listingSchema.validate(req.body);
if(error){
   throw new ExpressError(400, error.details.map(el => el.message).join(', '));
}

else{
  next();
}
}

app.get("/",(req,res)=>{
    console.log("i am here");
});
//delete
app.delete("/listings/:id",wrapAsyn(async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
//update
app.put("/listings/:id",validateListing, wrapAsyn(async(req,res)=>{
let {id} = req.params;

await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/listings");
}));
//edit route
app.get("/listings/:id/edit",wrapAsyn(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));
//create route
 app.post("/listings",validateListing,
  wrapAsyn( async (req,res)=>{
  const newlisting= new Listing(req.body.listing);
  await newlisting.save();
  console.log(newlisting);
  res.redirect("/listings");
  
})
);

app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")

});
//show
app.get("/listings/:id" ,wrapAsyn(async(req,res)=>{
let {id}  =req.params;
let mylist = await Listing.findById(id);
res.render("listings/show.ejs",{mylist});
}));
app.get("/listings",wrapAsyn(async(req,res)=>{
  const alllist =  await Listing.find({});
    res.render("listings/index.ejs",{alllist});
}));

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong!"}= err;
  res.status(statusCode).render("error.ejs",{err});
});
app.listen(8080,()=>{
    console.log("server listenning to 8080");
});
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const engine = require('ejs-mate');
const ExpressError= require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.use(express.urlencoded({ extended : true }));
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
}

app.get("/",(req,res)=>{
    console.log("i am here");
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

//All
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
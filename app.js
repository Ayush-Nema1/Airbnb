if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const engine = require('ejs-mate');
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const  flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.urlencoded({ extended : true }));
app.use(express.json()); 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use (express.static(path.join(__dirname,"/public")));



const dbUrl = process.env.ATLASDB_URL;
// console.log(dbUrl);
async function main() {

  await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("coonected to db");
})
.catch(err => console.log(err));



const store = mongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret :  process.env.SECERET,
  },
  touchAfter : 24 * 3600,
});
store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret : process.env.SECERET,
  resave : false,
  saveUninitialized: true,
  cookie : {
  expires: Date.now() + 7 * 24 * 60 *60 *1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly : true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
   next();
});



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
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
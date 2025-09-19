const express = require("express");
const router = express.Router( {mergeParams : true});
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { merge } = require("./listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


 
//Review route
router.post("/",
  isLoggedIn,
  validateReview ,
  wrapAsyn(async(req,res)=>{
console.log(req.params.id);
let listing = await Listing.findById(req.params.id);
let newreview = new Review(req.body.review);
newreview.author = req.user._id;

listing.reviews.push(newreview);
await newreview.save();
await listing.save();

console.log("new review saved");
req.flash("success" , "Review added successfully");
res.redirect(`/listings/${listing._id}`);
}));

//Delete REview Route

router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor
  ,wrapAsyn(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success" , "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
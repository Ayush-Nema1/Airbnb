const express = require("express");
const router = express.Router( {mergeParams : true});
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { merge } = require("./listing.js");

const validateReview=(req,res,next)=>{
 let {error} = reviewSchema.validate( req.body);
if(error){
   throw new ExpressError(400, error.details.map(el => el.message).join(', '));
}

else{
  next();
}
}

 
//Review rout
router.post("/",validateReview , wrapAsyn(async(req,res)=>{
console.log(req.params.id);
let listing = await Listing.findById(req.params.id);
let newreview = new Review(req.body.review);

listing.reviews.push(newreview);
await newreview.save();
await listing.save();

console.log("new review saved");
res.redirect(`/listings/${listing._id}`);
}));

//Delete REview Route

router.delete("/:reviewId",wrapAsyn(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
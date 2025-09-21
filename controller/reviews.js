const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");


module.exports.createReview = async(req,res)=>{
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
};

module.exports.deleteReview = async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success" , "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};

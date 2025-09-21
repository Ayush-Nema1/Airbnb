const express = require("express");
const router = express.Router( {mergeParams : true});
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { merge } = require("./listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");
 
//Review route
router.post("/",
  isLoggedIn,
  validateReview ,
  wrapAsyn(reviewController.createReview));

//Delete REview Route

router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor
  ,wrapAsyn(reviewController.deleteReview));

module.exports = router;
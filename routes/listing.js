const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");

//index
router.route("/")
.get(wrapAsyn(listingController.index))
.post(
  isLoggedIn,
  wrapAsyn(listingController.createListing )
);

//New
router.get("/new",
   isLoggedIn,
    listingController.renderNewForm
  );

//show
router.route("/:id")
.get(wrapAsyn(listingController.show))
.put(
    isOwner,
   validateListing,
   wrapAsyn(listingController.updateListing))
.delete(isLoggedIn,
    isOwner,
    wrapAsyn(listingController.deleteListing));
  
//edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsyn(listingController.renderEditform));



module.exports = router;
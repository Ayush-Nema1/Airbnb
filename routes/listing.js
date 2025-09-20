const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controller/listings.js");
//index
router.get("/",wrapAsyn(listingController.index));
//New
router.get("/new",
   isLoggedIn,
    listingController.renderNewForm
  );

//show
router.get("/:id" ,wrapAsyn(listingController.show));

//create route
 router.post("/",
  isLoggedIn,
  wrapAsyn(listingController.createListing )
);
//edit route
router.get("/:id/edit",isLoggedIn,
  isOwner,
  wrapAsyn(listingController.renderEditform));

//update
router.put("/:id",
    isOwner,
   validateListing,
   wrapAsyn(listingController.updateListing));

//delete
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsyn(listingController.deleteListing));

module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing=(req,res,next)=>{
 let {error} = listingSchema.validate(req.body);
if(error){
   throw new ExpressError(400, error.details.map(el => el.message).join(', '));
}

else{
  next();
}
}

//index
router.get("/",wrapAsyn(async(req,res)=>{
  const alllist =  await Listing.find({});
    res.render("listings/index.ejs",{alllist});
}));
//New
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs")

});

//show
router.get("/:id" ,wrapAsyn(async(req,res)=>{
let {id}  =req.params;
const mylist = await Listing.findById(id).populate("reviews");
if(!mylist){
  req.flash("error","listing you find does not exit");
  return res.redirect("/listings");
}
res.render("listings/show.ejs",{mylist});
}));
//create route
 router.post("/",validateListing,
  wrapAsyn( async (req,res)=>{
  const newlisting= new Listing(req.body.listing);
  await newlisting.save();
  req.flash("success","New listing addded");
  console.log(newlisting);
  res.redirect("/listings");
  
})
);
//edit route
router.get("/:id/edit",wrapAsyn(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
 if(!listing){
    req.flash("error","Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing})

}));

//update
router.put("/:id",validateListing, wrapAsyn(async(req,res)=>{
let {id} = req.params;

await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing UPDATED");
res.redirect("/listings");
}));

//delete
router.delete("/:id",wrapAsyn(async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success","LISTING DELETED");
     res.redirect("/listings");
}));

module.exports = router;
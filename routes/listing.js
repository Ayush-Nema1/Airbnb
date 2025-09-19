const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


//index
router.get("/",
  
  wrapAsyn(async(req,res)=>{
  const alllist =  await Listing.find({});
    res.render("listings/index.ejs",{alllist});
}));
//New
router.get("/new",
   isLoggedIn,
   (req,res)=>{
  res.render("listings/new.ejs")

});

//show
router.get("/:id" ,wrapAsyn(async(req,res)=>{
let {id}  =req.params;
const mylist = await Listing.findById(id).populate({ 
  path : "reviews",
  populate:{path : "author",
},
}).populate("owner");
if(!mylist){
  req.flash("error","listing you find does not exit");
  return res.redirect("/listings");
}
console.log(mylist);
res.render("listings/show.ejs",{mylist});
}));
//create route
 router.post("/",
  isLoggedIn,
  wrapAsyn( async (req,res)=>{
  const newlisting= new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success","New listing addded");
  console.log(newlisting);
  res.redirect("/listings");
  
})
);
//edit route
router.get("/:id/edit",isLoggedIn,
  isOwner,
  wrapAsyn(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
 if(!listing){
    req.flash("error","Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing})

}));

//update
router.put("/:id",
    isOwner,
   validateListing,
   wrapAsyn(async(req,res)=>{
let {id} = req.params;

await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing UPDATED");
res.redirect("/listings");
}));

//delete
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsyn(async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success","LISTING DELETED");
     res.redirect("/listings");
}));

module.exports = router;
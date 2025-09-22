const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
  const alllist =  await Listing.find({});
    res.render("listings/index.ejs",{alllist});
};

module.exports.renderNewForm =  (req,res)=>{
  res.render("listings/new.ejs")

};

module.exports.show = async(req,res)=>{
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
};

module.exports.createListing = async (req,res)=>{
  let url = req.file.path;
  let filename = req.file.filename;
 console.log(filename,url);
  const newlisting= new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = {filename,url};
  await newlisting.save();
  req.flash("success","New listing addded");
  console.log(newlisting);
  res.redirect("/listings");
  
};

module.exports.renderEditform = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
 if(!listing){
    req.flash("error","Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing})

};

module.exports.updateListing = async(req,res)=>{
let {id} = req.params;


let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
if(typeof req.file !== "undefined"){
let url = req.file.path;
let filename = req.file.filename;
listing.image = {url,filename};
await listing.save();
}
req.flash("success"," listing UPDATED");
res.redirect("/listings");
};

module.exports.deleteListing = async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success","LISTING DELETED");
     res.redirect("/listings");
};
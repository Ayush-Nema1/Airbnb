const mongoose = require("mongoose");
const Reviews = require("./reviews.js");
const { any } = require("joi");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title : {
        type:String,
        required : true,
    },
    description:  String,
   image: {
    filename: String,
    url: String,
  },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref : "Review",
      }
    ]
});

listingSchema.post("findOneAndDelete",async (listing)=> {
  await Reviews.deleteMany({_id : {$in : listing.reviews}});
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

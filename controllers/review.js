const Listing=require("../models/listing.js");
const Review=require("../models/review.js");



module.exports.createReview=async(req,res)=>
    {
        console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);//our created review will get passs to the backend
     newReview.author=req.user._id;//It going to become author of review the person who has logged in
     listing.reviews.push(newReview);//pushing this review in the listing model
     console.log(newReview);
     req.flash("success","New review Created");
     await newReview.save();
     await listing.save();
    
     res.redirect(`/listing/${listing._id}`);
    }

module.exports.deletereview=async(req,res)=>
    {
    let {id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});//when we delete the review it should removed from listing as well
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deletd");
    res.redirect(`/listing/${id}`);
    }
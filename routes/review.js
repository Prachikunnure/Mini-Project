const express = require("express");
const router = express.Router({mergeParams:true});//merging with parent params
const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExtendsError.js")
const Review = require("../models/review.js");
const { listingSchema ,reviewSchema} =require("../schema.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js")

//Reviews
router.post("/",isLoggedin,validateReview, WrapAsync(reviewController.createReview));

// Delete Review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,WrapAsync(reviewController.deletereview));

module.exports=router;


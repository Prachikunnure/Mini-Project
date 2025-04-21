const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExtendsError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const{isLoggedin}=require("../middleware.js");
const{isOwner,validateListing}=require("../middleware.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");

// const upload = multer({ dest: 'uploads/' })
 const upload = multer({ storage });//multer will upload file at storage

const ListingController = require("../controllers/listing.js");

// router.route concept
router
.route("/")
.get(WrapAsync(ListingController.index)) // Fetch listings index (defined in ListingController)
.post(
    isLoggedin, // Middleware to check if user is logged in
     upload.single("listing[image]"), // Middleware for uploading an image (currently commented)
    validateListing, // Middleware for validating listing data
    WrapAsync(ListingController.createRoute) // Middleware for creating a new listing
);



// New route
router.get("/new",isLoggedin,(ListingController.renderNewForm));
// edit
router
.route("/:id")
.get(isLoggedin, WrapAsync(ListingController.showListing))
// update
.put(
    isLoggedin,
    isOwner,
     upload.single("listing[image]"),//for uploading the image
    validateListing,
    WrapAsync(ListingController.updateRoute))
.delete(isLoggedin,
    isOwner,
    WrapAsync(ListingController.deleteroute));

    // Edit Route
router.get("/:id/edit",
    isLoggedin,
    WrapAsync(ListingController.editRoute));


module.exports = router;



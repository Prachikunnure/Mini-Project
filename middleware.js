const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExtendsError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//when user want create update delete the lising before he must be logged in for that  creating function and passing as middleware 
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
        {   
            req.session.redirectUrl= req.originalUrl;//when user log in then instaed of redirecting to the listing page he should go to expected page.
            req.flash("error","You have to be logged in to create page");
            console.log("validating....")
            return res.redirect("/login");
        }
         next(); 
}
module.exports.SaveRedirectUrl=(req,res,next)=>
{
if( req.session.redirectUrl)
{
    res.locals.redirectUrl= req.session.redirectUrl;
}
next();
};

module.exports.isOwner=async(req,res,next)=>
{
             //Authorization
             let { id } = req.params;
             let listing = await Listing.findById(id);
          
             console.log(listing);
            // console.log(res.locals.currentuser);
            // console.log(listing.owner);
            if( !listing.owner._id.equals(res.locals.currentuser._id))
            {
                req.flash("error","You dont have permission to make changes,You are not Owner");
                return res.redirect(`/listing/${id}`);
            }
            next();
}

// when we use listing related crud operation then validateListing
// validation as middleware server side error means will check whether all credentials are enetred well
// in joi references in case of sending it from hopscotch
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);//listingschema is we importes then validate is its fun
    if (error) {
        console.log("listed")
        let errMsg = error.details.map((ele) => ele.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

};


// when we use listing related crud operation then validatereview
module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);//listingschema is we importes then validate is its fun
   if(error)
    {   let errMsg = error.details.map((ele)=>ele.message).join(",");
        throw new ExpressError( 400 ,errMsg);
    }else{
        next();
    }
     
};
module.exports.isReviewAuthor=async(req,res,next)=>
    {
                 //Authorization
                 let {id, reviewId } = req.params;
                 let review = await Review.findById(reviewId);
                 console.log(res.locals.currentuser);
                console.log(review.author);
                if(!review.author._id.equals(res.locals.currentuser._id))
                {
                    req.flash("error","You dont have permission to make changes,You are not Author ");
                    return res.redirect(`/listing/${id}`);
                }
                next();
    }
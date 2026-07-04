const Listing = require("../models/listing");

// It is asycn function
// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
// new listing
module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
}
// show listing
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    }).populate("owner");
   if(!listing)
   {
    req.flash("error","Listing does not found");
    res.redirect("/listing");
   }
//    console.log("with population",listing);    
    res.render("listings/show.ejs", { listing });

};

// post the listing
module.exports.createRoute=async (req, res, next) => {
    console.log("Posted");
    let url= req.file.path;
    let filename= req.file.filename;
    console.log(url,"...",filename);
   const newListing = new Listing(req.body.listing);
  
   newListing.owner= req.user._id;
   newListing.image={url,filename};
    await newListing.save();
    console.log(newListing);
    req.flash("success","New listing Created");
    res.redirect("/listing");
    };
// edit the route
module.exports.editRoute=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let originalUrl=listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    
    if(!listing)
        {
         req.flash("error","Listing does not found");
         res.redirect("/listing");
        }

     res.render("listings/edit.ejs", { listing ,originalUrl});
}

// update route
module.exports.updateRoute=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing})
    if(typeof req.file!=="undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    // await updatedData.save();
    req.flash("success","current listing updated");
    res.redirect(`/listing/${id}`);

}
// Delete The routec
module.exports.deleteroute=async (req, res) =>
{
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","listing deleted");
    res.redirect("/listing");
};
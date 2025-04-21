const Listing = require("../models/listing");

// It is asycn function
// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
// new listing
module.exports.renderNewForm= (req, res) => {
    // console.log(req.user);//when go to cretae new listing for that check below when user enter then it prints user that has loged in
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
    }).populate("owner");//it will come with listing info with reviews with populate.first check on console.by print
   if(!listing)
   {
    req.flash("error","Listing does not found");
    res.redirect("/listing");
   }
//    console.log(listing);    
    res.render("listings/show.ejs", { listing });

};

// post the listing
module.exports.createRoute=async (req, res, next) => {
    console.log("Posted");
    let url= req.file.path;
    let filename= req.file.filename;//extracting url and filename from file
    console.log(url,"...",filename);//when we change in the model image then created data will be with url and filename for that 
   const newListing = new Listing(req.body.listing);
  
   newListing.owner= req.user._id;//user with which we are login is considered as req.user thatt is default
   newListing.image={url,filename};//when we upload the listing then we will add  one url and one filename
    await newListing.save();
    console.log(newListing);
    req.flash("success","New listing Created");//when we post new created listing
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
   if(typeof req.file!=="undefined"){//whwn we dont upload any file 
   //we will extract file path and filename of updated list
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    // await updatedData.save();
    req.flash("success","current listing updated");
    res.redirect(`/listing/${id}`);//redirecting to the details by id

}
// Delete The route
module.exports.deleteroute=async (req, res) =>//check its middleware in listing model
{
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","listing deleted");
    res.redirect("/listing");
};
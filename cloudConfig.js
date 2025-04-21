const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

cloudinary.config({   //config with our env file
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET

});


// fron npm multer-storage-cloudinarary ,storagecode
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WanderLust_Dev',
      allowFormats:["jpeg","png","jpg"] ,
    },
  });



module.exports={
    cloudinary,
    storage      //exporting this to routes->listing.js
}
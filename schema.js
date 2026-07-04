const Joi = require("joi");
// whenever we will create listiing then there should be its joi object

module.exports.listingSchema = Joi.object({
   listing : Joi.object({
   title : Joi.string().required(),
   description : Joi.string().required(),
   location : Joi.string().required(),
   country : Joi.string().required(),
   price : Joi.number().required().min(0),
   image : Joi.string().allow("",null),
   }).required()
});

module.exports.reviewSchema = Joi.object({

   review: Joi.object({
   rating: Joi.number().required().min(1).max(5),
   comment: Joi.string().required()
   }).required()
});




// Define Joi validation for the booking schema
module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    // Ensures `userId` is provided as a string (ObjectId in string form)
    // Ensures `villaId` is provided as a string (ObjectId in string form)
    checkIn: Joi.date().required(), // Validates the `checkIn` date
    checkOut: Joi.date().required(), // Validates the `checkOut` date
    guests: Joi.number().min(1).required(), // Validates the number of guests (at least 1)
   
    // bookingStatus: Joi.string()
    //   .valid("Pending", "Confirmed", "Cancelled")
    //   .default("Pending"), // Ensures `bookingStatus` has valid values and defaults to 'Pending'
  
  }).required(), // Makes the `booking` object mandatory
});

const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { isLoggedin, validatebooking } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.get("/", isLoggedin, WrapAsync(bookingController.indexBookings));

router.get(
  "/new/:listingId",
  isLoggedin,
  WrapAsync(bookingController.renderNewForm)
);

router.post(
  "/:listingId",
  isLoggedin,
  validatebooking,
  WrapAsync(bookingController.createBooking)
);

router.delete(
  "/:bookingId",
  isLoggedin,
  WrapAsync(bookingController.cancelBooking)
);

module.exports = router;

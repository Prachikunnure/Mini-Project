const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const ExpressError = require("../utils/ExtendsError.js");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function calculateNights(checkIn, checkOut) {
  const nights = Math.round(
    (startOfDay(checkOut) - startOfDay(checkIn)) / MS_PER_DAY
  );
  return nights;
}

async function hasOverlappingBooking(listingId, checkInDate, checkOutDate) {
  const overlap = await Booking.findOne({
    listing: listingId,
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  });
  return Boolean(overlap);
}

module.exports.renderNewForm = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listing/${listing._id}`);
  }

  res.render("listings/booking.ejs", { listing });
};

module.exports.createBooking = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listing/${listing._id}`);
  }

  const checkInDate = startOfDay(req.body.booking.checkIn);
  const checkOutDate = startOfDay(req.body.booking.checkOut);
  const guests = Number(req.body.booking.guests);
  const today = startOfDay(new Date());

  if (checkInDate < today) {
    throw new ExpressError(400, "Check-in date cannot be in the past");
  }

  if (checkOutDate <= checkInDate) {
    throw new ExpressError(400, "Check-out date must be after check-in date");
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights < 1) {
    throw new ExpressError(400, "Booking must be for at least one night");
  }

  if (await hasOverlappingBooking(listing._id, checkInDate, checkOutDate)) {
    req.flash("error", "These dates are not available for this listing");
    return res.redirect(`/bookings/new/${listing._id}`);
  }

  const totalPrice = listing.price * nights;

  const newBooking = new Booking({
    user: req.user._id,
    listing: listing._id,
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
  });

  listing.booking.push(newBooking._id);
  await newBooking.save();
  await listing.save();

  req.flash(
    "success",
    `Booking confirmed for ${nights} night(s). Total: ₹${totalPrice.toLocaleString("en-IN")}`
  );
  res.redirect(`/listing/${listing._id}`);
};

module.exports.indexBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/index.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/bookings");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You do not have permission to cancel this booking");
    return res.redirect("/bookings");
  }

  const listingId = booking.listing._id;
  await Listing.findByIdAndUpdate(listingId, {
    $pull: { booking: bookingId },
  });
  await Booking.findByIdAndDelete(bookingId);

  req.flash("success", "Booking cancelled");
  res.redirect("/bookings");
};

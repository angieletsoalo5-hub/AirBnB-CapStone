const mongoose = require('mongoose');

const specificRatingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, min: 0, max: 5, default: 0 },
    communication: { type: Number, min: 0, max: 5, default: 0 },
    checkIn: { type: Number, min: 0, max: 5, default: 0 },
    accuracy: { type: Number, min: 0, max: 5, default: 0 },
    location: { type: Number, min: 0, max: 5, default: 0 },
    value: { type: Number, min: 0, max: 5, default: 0 },
  },
  { _id: false }
);

const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Accommodation type is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    guests: { type: Number, required: true, min: 1 },
    price: { type: Number, required: [true, 'Price per night is required'], min: 0 },

    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image is required',
      },
    },

    // Cost calculator fields
    weeklyDiscount: { type: Number, default: 0 },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    occupancyTaxes: { type: Number, default: 0 },

    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },

    // Booking policy flags
    freeCancellation: { type: Boolean, default: false },
    instantBook: { type: Boolean, default: false },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, default: 0 },
    specificRatings: { type: specificRatingsSchema, default: () => ({}) },

    // Confirmed date ranges currently held against this listing.
    // Lives on the Accommodation document so a single atomic
    // findOneAndUpdate can check overlap AND push the new range
    // in one indivisible step — prevents double bookings under
    // concurrent requests.
    bookedDates: {
      type: [
        {
          _id: false,
          checkIn: { type: Date, required: true },
          checkOut: { type: Date, required: true },
          reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation',
            required: true,
          },
        },
      ],
      default: [],
    },

    // Owner of the listing
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);

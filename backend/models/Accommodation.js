const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    weeklyDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    cleaningFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    occupancyTaxes: {
      type: Number,
      default: 0,
      min: 0,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Accommodation",
  accommodationSchema
);
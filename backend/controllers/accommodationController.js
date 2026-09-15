const Accommodation = require("../models/Accommodation");
const Reservation = require("../models/Reservation");

// Create a new accommodation
const createAccommodation = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      type,
      price,
      images,
      amenities,
      maxGuests,
      bedrooms,
      bathrooms,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
    } = req.body;

    const newAccommodation = await Accommodation.create({
      title,
      description,
      location,
      type,
      price,
      images,
      amenities,
      maxGuests,
      bedrooms,
      bathrooms,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      host: req.user.id,
    });

    res.status(201).json({
      message: "Accommodation created successfully",
      accommodation: newAccommodation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all accommodations
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate(
      "host",
      "username email"
    );

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get available accommodations for selected dates
const getAvailableAccommodations = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "Please provide check-in and check-out dates",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        message: "Please provide valid dates",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    const overlappingReservations = await Reservation.find({
      status: "confirmed",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select("accommodation");

    const bookedAccommodationIds =
      overlappingReservations.map(
        (reservation) => reservation.accommodation
      );

    const availableAccommodations =
      await Accommodation.find({
        _id: { $nin: bookedAccommodationIds },
      }).populate("host", "username email");

    res.status(200).json(availableAccommodations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get one accommodation by ID
const getAccommodationById = async (req, res) => {
  try {
    const accommodation =
      await Accommodation.findById(
        req.params.id
      ).populate("host", "username email");

    if (!accommodation) {
      return res.status(404).json({
        message: "Accommodation not found",
      });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update an accommodation
const updateAccommodation = async (req, res) => {
  try {
    const accommodation =
      await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        message: "Accommodation not found",
      });
    }

    // Allow the listing host or an admin to update it
    if (
      accommodation.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Not authorized to update this accommodation",
      });
    }

    const {
      title,
      description,
      location,
      type,
      price,
      images,
      amenities,
      maxGuests,
      bedrooms,
      bathrooms,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
    } = req.body;

    const updatedAccommodation =
      await Accommodation.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          location,
          type,
          price,
          images,
          amenities,
          maxGuests,
          bedrooms,
          bathrooms,
          weeklyDiscount,
          cleaningFee,
          serviceFee,
          occupancyTaxes,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Accommodation updated successfully",
      accommodation: updatedAccommodation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete an accommodation
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation =
      await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        message: "Accommodation not found",
      });
    }

    // Allow the listing host or an admin to delete it
    if (
      accommodation.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Not authorized to delete this accommodation",
      });
    }

    await Accommodation.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Accommodation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAvailableAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
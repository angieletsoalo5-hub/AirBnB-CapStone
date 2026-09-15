const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const {
      accommodation,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (
      !accommodation ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return res.status(400).json({
        message:
          "Please provide accommodation, check-in, check-out, and guests",
      });
    }

    const selectedAccommodation =
      await Accommodation.findById(accommodation);

    if (!selectedAccommodation) {
      return res.status(404).json({
        message: "Accommodation not found",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        message:
          "Please provide valid reservation dates",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date",
      });
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      return res.status(400).json({
        message: "Guests must be at least 1",
      });
    }

    if (
      guestCount >
      selectedAccommodation.maxGuests
    ) {
      return res.status(400).json({
        message: `This accommodation allows a maximum of ${selectedAccommodation.maxGuests} guests`,
      });
    }

    // Check whether the accommodation is already booked
    // for any overlapping confirmed reservation
    const conflictingReservation =
      await Reservation.findOne({
        accommodation,
        status: "confirmed",
        checkIn: {
          $lt: checkOutDate,
        },
        checkOut: {
          $gt: checkInDate,
        },
      });

    if (conflictingReservation) {
      return res.status(409).json({
        message:
          "Accommodation is not available for the selected dates",
      });
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOutDate - checkInDate) /
        millisecondsPerDay
    );

    const totalPrice =
      nights * selectedAccommodation.price;

    const newReservation =
      await Reservation.create({
        user: req.user.id,
        accommodation,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestCount,
        totalPrice,
        status: "confirmed",
      });

    res.status(201).json({
      message:
        "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get reservations for the logged-in user
const getMyReservations = async (req, res) => {
  try {
    const reservations =
      await Reservation.find({
        user: req.user.id,
      }).populate("accommodation");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get one reservation by ID
const getReservationById = async (
  req,
  res
) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      ).populate("accommodation");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (
      reservation.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Not authorized to view this reservation",
      });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Cancel a reservation
const cancelReservation = async (
  req,
  res
) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (
      reservation.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Not authorized to cancel this reservation",
      });
    }

    reservation.status = "cancelled";

    await reservation.save();

    res.status(200).json({
      message:
        "Reservation cancelled successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all reservations - admin only
const getAllReservations = async (
  req,
  res
) => {
  try {
    const reservations =
      await Reservation.find()
        .populate(
          "user",
          "username email"
        )
        .populate("accommodation");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getAllReservations,
};
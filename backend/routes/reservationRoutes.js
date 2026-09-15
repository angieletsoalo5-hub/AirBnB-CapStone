const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getAllReservations,
} = require("../controllers/reservationController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Create a new reservation
router.post("/", protect, createReservation);

// Get all reservations - admin only
router.get("/admin/all", protect, adminOnly, getAllReservations);

// Get reservations for the logged-in user
router.get("/my-reservations", protect, getMyReservations);

// Get a specific reservation by ID
router.get("/:id", protect, getReservationById);

// Cancel a reservation
router.put("/:id/cancel", protect, cancelReservation);

module.exports = router;
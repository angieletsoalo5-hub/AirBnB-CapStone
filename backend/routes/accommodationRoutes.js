const express = require("express");

const router = express.Router();

const {
  createAccommodation,
  getAccommodations,
  getAvailableAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Get all accommodations
router.get("/", getAccommodations);

// Get available accommodations by selected dates
router.get("/available", getAvailableAccommodations);

// Admin-only test route
router.get("/admin/all", protect, adminOnly, getAccommodations);

// Get one accommodation by ID
router.get("/:id", getAccommodationById);

// Create a new accommodation
router.post("/", protect, createAccommodation);

// Update an accommodation
router.put("/:id", protect, updateAccommodation);

// Delete an accommodation
router.delete("/:id", protect, deleteAccommodation);

module.exports = router;
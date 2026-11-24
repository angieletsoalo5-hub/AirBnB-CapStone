const express = require('express');
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getAccommodations)
  .post(protect, authorize('host'), upload.array('images', 10), createAccommodation);

router
  .route('/:id')
  .get(getAccommodationById)
  .put(protect, authorize('host'), upload.array('images', 10), updateAccommodation)
  .delete(protect, authorize('host'), deleteAccommodation);

module.exports = router;

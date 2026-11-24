const Accommodation = require('../models/Accommodation');
const asyncHandler = require('../utils/asyncHandler');

// Helper: merge URL-string images (from the form's existingImages JSON field)
// with any physically uploaded files (req.files from Multer).
function buildImages(req) {
  let images = [];

  if (req.body.existingImages) {
    try {
      const parsed = JSON.parse(req.body.existingImages);
      if (Array.isArray(parsed)) images = parsed;
    } catch (_) {
      if (req.body.existingImages) images = [req.body.existingImages];
    }
  }

  if (req.files && req.files.length > 0) {
    const uploadedUrls = req.files.map((f) => `/uploads/${f.filename}`);
    images = [...images, ...uploadedUrls];
  }

  return images;
}

// @desc    Create a new accommodation listing
// @route   POST /api/accommodations
// @access  Private (host)
const createAccommodation = asyncHandler(async (req, res) => {
  const images = buildImages(req);

  const accommodation = await Accommodation.create({
    ...req.body,
    ...(images.length > 0 && { images }),
    host: req.user._id,
  });

  res.status(201).json(accommodation);
});

// @desc    Get all accommodations, optionally filtered by location and host
// @route   GET /api/accommodations?location=New York&host=<id>
// @access  Public
const getAccommodations = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }

  if (req.query.host) {
    filter.host = req.query.host;
  }

  const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 });
  res.json(accommodations);
});

// @desc    Get a single accommodation by id
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id)
    .populate('host', 'username createdAt');

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  res.json(accommodation);
});

// @desc    Update an accommodation listing
// @route   PUT /api/accommodations/:id
// @access  Private (host who owns the listing)
const updateAccommodation = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  if (accommodation.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  const images = buildImages(req);
  Object.assign(accommodation, req.body);
  if (images.length > 0) accommodation.images = images;

  const updated = await accommodation.save();

  res.json(updated);
});

// @desc    Delete an accommodation listing
// @route   DELETE /api/accommodations/:id
// @access  Private (host who owns the listing)
const deleteAccommodation = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  if (accommodation.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }

  await accommodation.deleteOne();
  res.json({ message: 'Accommodation removed', id: req.params.id });
});

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};

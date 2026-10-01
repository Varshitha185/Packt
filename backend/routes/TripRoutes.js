const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");
const { generateTripPlan } = require("../services/GeminiService");

// Create a new trip
router.post("/", authMiddleware, async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      owner: req.user.id,
      aiItinerary: "",
    });

    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Get all trips
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      owner: req.user.id,
    });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get one trip by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Generate itinerary for a specific trip
router.post("/:id/generate-itinerary", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const days =
      Math.ceil(
        (new Date(trip.endDate) - new Date(trip.startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const itinerary = await generateTripPlan({
      destination: trip.destination,
      days,
      people: trip.members.length || 1,
      budget: trip.budget,
      interests: trip.vibe,
    });

    trip.aiItinerary = itinerary;

    await trip.save();

    res.status(200).json({
      message: "Itinerary generated successfully",
      itinerary: trip.aiItinerary,
    });
  } catch (error) {
    console.error("Itinerary generation error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
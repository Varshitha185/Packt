const express = require("express");
const router = express.Router();

const { generateTripPlan } = require("../services/GeminiService");

router.post("/plan-trip", async (req, res) => {
  try {
    const itinerary = await generateTripPlan(req.body);

    res.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
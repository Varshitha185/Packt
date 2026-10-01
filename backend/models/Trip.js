const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    members: [
      {
        name: String,
      },
    ],

    budget: {
      type: String,
      default: "",
    },

    vibe: {
      type: String,
      default: "",
    },

    aiItinerary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
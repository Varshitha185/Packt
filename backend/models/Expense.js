const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paidBy: {
      type: String,
      required: true,
    },

    splitBetween: [
      {
        name: String,
      },
    ],

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Create a new expense
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Get smart settlement for one trip
router.get("/summary/:tripId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      tripId: req.params.tripId,
    });

    const balances = {};

    // Calculate everyone's balance
    expenses.forEach((expense) => {
      const share = expense.amount / expense.splitBetween.length;

      if (!balances[expense.paidBy]) {
        balances[expense.paidBy] = 0;
      }

      balances[expense.paidBy] += expense.amount;

      expense.splitBetween.forEach((person) => {
        if (!balances[person.name]) {
          balances[person.name] = 0;
        }

        balances[person.name] -= share;
      });
    });

    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([name, amount]) => {
      if (amount < 0) {
        debtors.push({
          name,
          amount: Math.abs(amount),
        });
      } else if (amount > 0) {
        creditors.push({
          name,
          amount,
        });
      }
    });

    const settlements = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const payment = Math.min(
        debtors[i].amount,
        creditors[j].amount
      );

      settlements.push({
        from: debtors[i].name,
        to: creditors[j].name,
        amount: payment,
      });

      debtors[i].amount -= payment;
      creditors[j].amount -= payment;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    res.json({
      settlements,
      balances,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all expenses for one trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      tripId: req.params.tripId,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete an expense
router.delete("/:expenseId", async (req, res) => {
  try {
    const deletedExpense =
      await Expense.findByIdAndDelete(req.params.expenseId);

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
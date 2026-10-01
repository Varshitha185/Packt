const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const tripRoutes = require("./routes/TripRoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const aiRoutes = require("./routes/AIRoutes");
const authRoutes = require("./routes/AuthRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("PACKT backend is alive 🚀");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "PACKT API is working!",
        status: "success"
    });
});

app.listen(PORT, () => {
    console.log(`PACKT server running on port ${PORT}`);
});
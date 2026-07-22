const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const settingsRoutes = require("./routes/settings");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/export", require("./routes/export"));
app.use("/api/pdf", require("./routes/pdf"));
app.use("/settings", settingsRoutes);

// Fallback route
app.get("/", (req, res) => {
  res.send("Budget Manager API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

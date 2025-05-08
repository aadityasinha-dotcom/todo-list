const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const app = express();

// CORS middleware - enable it for all routes
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both localhost variants
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'] // Include your auth header
}));

// Connect Database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// Define Route
app.use("/api/users", require("./routes/users"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/auth", require("./routes/auth"));

app.use(express.static(path.join(__dirname,"./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

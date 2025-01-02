require('dotenv').config(); // Load environment variables

// Import necessary modules
const express = require('express');
const cors = require('cors');

// Database connection
const dbconnection = require('./db/dbConfig');

// Create an Express application
const app = express();

// Set port number dynamically for Render deployment
const port = process.env.PORT || 3004;

// Enable CORS for specified origins
app.use(
  cors({
    origin: ["http://localhost:5173"], // Add more origins as needed
  })
);

// Middleware to parse JSON data
app.use(express.json());

// Import route files
const userRoutes = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

// Define API routes
app.use("/api/users", userRoutes);
app.use("/api", questionRoute);
app.use("/api", answerRoute);

// Start the server and handle database connection
async function start() {
  try {
    // Test database connection
    const result = await dbconnection.execute("SELECT 'test' ");
    console.log(result);

    // Explicitly bind to 0.0.0.0 for Render compatibility
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
}

// Initialize the server
start();
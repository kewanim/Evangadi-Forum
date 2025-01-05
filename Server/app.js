require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

// Import Firestore configuration
const db = require("./db/dbConfig"); // Firestore connection

// Import routes
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

// Create Express app
const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes middleware
app.use("/api/users", userRoutes); // User routes
app.use("/api/questions", questionRoutes); // Question routes
app.use("/api/answers", answerRoutes); // Answer routes

// Test Firestore Connection
const { collection, getDocs } = require("firebase/firestore");
app.get("/test", async (req, res) => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(users);
  } catch (error) {
    console.error("Firestore connection error:", error);
    res.status(500).send("Error connecting to Firestore.");
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
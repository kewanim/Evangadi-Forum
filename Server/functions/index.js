const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Register User API
exports.registerUser = onRequest(async (req, res) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    // Parse user input
    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).send({ error: "All fields are required!" });
    }

    // Check if user already exists
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).send({ error: "User already exists!" });
    }

    // Store user in Firestore
    const newUser = {
      username,
      firstname,
      lastname,
      email,
      password, // Encrypt this in a real app!
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("users").add(newUser);

    res.status(201).send({ msg: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong!" });
  }
});

// Test Endpoint
exports.helloWorld = onRequest((req, res) => {
  res.send("Hello from Firebase!");
});
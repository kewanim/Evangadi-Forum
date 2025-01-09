const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.registerUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    try {
      const newUser = {
        username,
        firstname,
        lastname,
        email,
        password,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin.firestore().collection("users").add(newUser);
      res.status(201).send({ message: "User registered successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong!");
    }
  });
});

// Test Endpoint to Check Deployment
exports.helloWorld = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.send("Hello from Firebase!");
  });
});
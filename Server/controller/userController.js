const { getFirestore, doc, setDoc, getDoc, query, where, getDocs, collection } = require("firebase/firestore");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const db = require("../db/dbConfig"); // Firestore db instance

// REGISTER USER
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  // Validate required fields
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required information." });
  }

  try {
    // Check if user already exists
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("username", "==", username), where("email", "==", email));
    const existingUsers = await getDocs(userQuery);

    if (!existingUsers.empty) {
      return res.status(StatusCodes.CONFLICT).json({ msg: "User already registered." });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Password must be at least 8 characters." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user ID and save to Firestore
    const newUser = {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    };
    const userDoc = doc(usersRef); // Generate random ID
    await setDoc(userDoc, newUser);

    res.status(StatusCodes.CREATED).json({ msg: "User registered successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred." });
  }
}

// LOGIN USER
async function login(req, res) {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required fields." });
  }

  try {
    // Get user from Firestore
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(userQuery);

    if (snapshot.empty) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password." });
    }

    // Get user data
    const user = snapshot.docs[0].data();

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({ msg: "User logged in successfully", token });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred." });
  }
}

// CHECK USER
function checkUser(req, res) {
  const username = req.user.username;
  const email = req.user.email;
  return res.status(StatusCodes.OK).json({ username, email });
}

module.exports = { register, login, checkUser };
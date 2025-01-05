// hashPassword.js
const bcrypt = require('bcrypt');

// Replace 'password123' with the password you want to hash
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed Password:", hash);
});
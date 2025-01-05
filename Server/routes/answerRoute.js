const express = require("express");
const router = express.Router();

// Import the controller
const { getAnswer, postAnswer } = require("../controller/answerController");

// POST an answer
router.post("/", postAnswer);

// GET answers for a question
router.get("/:question_id", getAnswer);

module.exports = router;
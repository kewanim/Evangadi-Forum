const express = require("express");
const router = express.Router();
const {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} = require("../controller/questionController");

// Post a question
router.post("/", postQuestion);

// Get all questions
router.get("/", getAllQuestions);

// Get a single question and its answers
router.get("/:question_id", getQuestionAndAnswer);

module.exports = router;
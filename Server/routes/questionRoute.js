const express = require("express");
const router = express.Router();

const {
  postQuestion,
  getAllQuestions,
  getQuestionAndAnswer,
} = require("../controller/questionController");

// Get all questions
router.get("/questions", getAllQuestions);

// Get a single question
router.get("/question/:question_id", getQuestionAndAnswer);

// Post a question
router.post("/questions", postQuestion);

module.exports = router;
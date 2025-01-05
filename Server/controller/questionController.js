const { StatusCodes } = require("http-status-codes");
const { collection, addDoc, getDocs, doc, getDoc } = require("firebase/firestore");
const db = require("../db/dbConfig");

// Post a question
async function postQuestion(req, res) {
  const { userid, title, description, tag } = req.body;

  // Validate input fields
  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    // Add question to Firestore
    const docRef = await addDoc(collection(db, "questions"), {
      userid,
      title,
      description,
      tag,
      createdAt: new Date().toISOString(),
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully", id: docRef.id });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Get all questions
async function getAllQuestions(req, res) {
  try {
    const questionsCollection = collection(db, "questions");
    const snapshot = await getDocs(questionsCollection);
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(StatusCodes.OK).json(questions);
  } catch (err) {
    console.error("Database Error: ", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Get single question and answers
async function getQuestionAndAnswer(req, res) {
  const questionId = req.params.question_id;

  try {
    // Fetch the question
    const questionDoc = await getDoc(doc(db, "questions", questionId));
    if (!questionDoc.exists()) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const questionData = questionDoc.data();

    // Fetch related answers
    const answersSnapshot = await getDocs(collection(db, `questions/${questionId}/answers`));
    const answers = answersSnapshot.docs.map(doc => doc.data());

    const response = {
      id: questionDoc.id,
      ...questionData,
      answers,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching question details" });
  }
}

module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };
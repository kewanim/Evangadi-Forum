const { StatusCodes } = require("http-status-codes");
const { collection, addDoc, getDocs, query, where } = require("firebase/firestore");
const db = require("../db/dbConfig"); // Firestore database connection

// ========================
// POST an Answer
// ========================
async function postAnswer(req, res) {
  const { userid, answer, questionid } = req.body;

  // Validate input
  if (!userid || !answer || !questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
  }

  try {
    // Prepare the answer data
    const newAnswer = {
      userid,
      answer,
      questionid,
      createdAt: new Date().toISOString(), // Timestamp
    };

    // Add the answer to Firestore
    await addDoc(collection(db, "answers"), newAnswer);

    // Send success response
    return res.status(StatusCodes.CREATED).json({ message: "Answer posted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
  }
}

// ========================
// GET Answers for a Question
// ========================
async function getAnswer(req, res) {
  const questionid = req.params.question_id;

  try {
    // Query Firestore for answers linked to the question ID
    const answersQuery = query(collection(db, "answers"), where("questionid", "==", questionid));
    const snapshot = await getDocs(answersQuery);

    // Map results into an array
    const answers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Send the results
    return res.status(StatusCodes.OK).json({ answers });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
  }
}

// Export the functions
module.exports = {
  postAnswer,
  getAnswer,
};
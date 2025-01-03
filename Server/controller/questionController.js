const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

// Post a question
async function postQuestion(req, res) {
  const { userid, title, description, tag } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questions (userid, title, description, tag) VALUES (?, ?, ?, ?)",
      [userid, title, description, tag]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// Get all questions
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`
      SELECT q.id, q.title, q.description, q.createdAt, u.username
      FROM questions q
      INNER JOIN users u ON q.userid = u.userid
      ORDER BY q.createdAt DESC
    `);
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
  const questionid = req.params.question_id;

  try {
    const [rows] = await dbConnection.query(`
      SELECT 
          q.id AS questionid, 
          q.title, 
          q.description, 
          q.createdAt AS qtn_createdAt,
          u.username AS qtn_username,
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt AS answer_createdAt,
          u2.username AS answer_username
      FROM 
          questions q
      LEFT JOIN 
          answers a ON q.id = a.questionid
      LEFT JOIN users u ON q.userid = u.userid
      LEFT JOIN users u2 ON u2.userid = a.userid
      WHERE 
          q.id = ?
      ORDER BY a.createdAt DESC
    `, [questionid]);

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const questionDetails = {
      id: rows[0].questionid,
      title: rows[0].title,
      description: rows[0].description,
      qtn_createdAt: rows[0].qtn_createdAt,
      qtn_username: rows[0].qtn_username,
      answers: rows
        .filter((answer) => answer.answerid !== null)
        .map((answer) => ({
          answerid: answer.answerid,
          userid: answer.answer_userid,
          username: answer.answer_username,
          answer: answer.answer,
          createdAt: answer.answer_createdAt,
        })),
    };

    res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching question details" });
  }
}

module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };
require('dotenv').config(); // Load environment variables



const express = require('express');
require('dotenv').config();


         // db connection
const dbconnection = require('./db/dbConfig');




const app = express();
const cors = require("cors");
const port = 3004


// sample to test the server is working
// app.get(`/`, (req, res)=> {
// res.send("welcome")
// })

// user routes middleware file
const useRoutes = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute")

app.use(
  cors(
    (origins = [
      "http://localhost:5173",
    ])
  )
);

// json middleware to extract json data
app.use(express.json());
// user routes middleware 
app.use("/api/users", useRoutes);

app.use("/api", questionRoute)
app.use("/api", answerRoute)

// questions routes middleware ??


// answers routes middleware ??


async function start() {
    try {
      const result = await dbconnection.execute("select 'test' ") 
    // const [result] = await dbconnection.query("SELECT 'test' AS result");

        console.log(result)
       await app.listen(port)
        console.log("database connection established")
        console.log(`listing on ${port}`)
     } catch (error) {
         console.log(error.message);
         
     }
     
}
 start() 


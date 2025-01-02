require('dotenv').config();
const mysql2 = require('mysql2');

const dbconnection = mysql2.createPool({
    user: process.env.DB_USER || 'forum_admin',
    database: process.env.DB_NAME || 'evangadi_forum',
    password: process.env.DB_PASSWORD || 'forum_admin',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    host:"localhost",
    connectionLimit: 10
})

// check the connection b/n dotenv & dbConfig first require dotenv with config @ app.js
// console.log(process.env.JWT_SECRET);


// when we insert data for  register,answer,question....will happen call backheal so we should turn to PROMISE based
// dbconnection.execute( "select 'test' ", (err,result)=> {

//     if(err) {
//         console.log(err.message);
//     }else{
//         console.log(result);

//     }
// })


module.exports = dbconnection.promise(); 













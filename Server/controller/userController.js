// these component used to "for big project there is MVC...the arctict folder structure module(database),view(front end or cliant),controller" found in back-end and communicate with database

         // db connection
const dbconnection = require('../db/dbConfig')

const  bcrypt = require('bcrypt')
const  {StatusCodes} = require('http-status-codes')
const jwt = require("jsonwebtoken");



async function register(req,res) {
    // res.send("register")
    const {username, firstname, lastname, email,password } = req.body
    if (!username || !firstname || !lastname || !email || !password ){
        return  res.status(StatusCodes.BAD_REQUEST).json({ 
                         msg: "please provide all required information"})
    }
    try {
        const [user] = await dbconnection.query ("SELECT username, userid FROM users WHERE username = ? or email = ?",[username,email])
        // return  res.json({user: user})
        if(user.length>0){
            return  res.status(StatusCodes.CONFLICT).json({ 
                                         msg: "user already register"})
        }
        if(password.length <= 8){
            return  res.status(StatusCodes.BAD_REQUEST).json({ 
                                    msg: "password must be at least 8 characters"})                        
        }

        //   encrypt thev password
        const salt = await bcrypt.genSalt(10)
       const hashedpassword = await bcrypt.hash(password,salt) 
        await dbconnection.query("INSERT INTO users (username,firstname ,lastname,email, password)VALUES (?,?,?,?,?)" ,[username,firstname ,lastname,email,  hashedpassword] )
        return  res.status(StatusCodes.CREATED).json({ 
            msg: "User registered successfully"})
    } catch (error) {
        console.log(error.message);
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                 msg: "An unexpected error occurred."})
    }
}

async function login(req,res) {
    // res.send("login")
    const {email,password} = req.body;
    // console.log(req.body);

    if(!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required fields"});
    }
    try {
         const [user] = await dbconnection.query ("SELECT username, userid , password FROM users WHERE email = ?",[email])

        if (user.length == 0){
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password"})
        }
        // COMPARE password..., we use awaite b/c of isMatch return as apromise boolean value and also user is an array
        const isMatch = await bcrypt.compare(password,user[0].password);
        if(!isMatch){
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid username or password"})
        }


           // Generate JWT token use to user hold in signin
    const username = user[0].username;
    const userid = user[0].userid;
    const secret = process.env.JWT_SECRET;
    // console.log(username, userid);
    const token = jwt.sign({ username, userid }, secret, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Return the token and success message
    return res.status(StatusCodes.OK).json({
      msg: "User logged in successfully",
      token: token,
    });
    } catch (error) { 
        console.log(error.message);  
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "An unexpected error occurred."})
    }
}

function checkUser(req,res) {
    // console.log("req=---", req , "res =====", res);
    
    // res.send("check user")
    const username = req.user.username;
    const userid = req.user.userid;
    return res.status(StatusCodes.OK).json({ username, userid });
}

module.exports = {register,login,checkUser}
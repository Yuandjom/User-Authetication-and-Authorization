const User = require('../model/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async(req, res, next)=> {
    //destructure the object 
    const {name, email, password} = req.body;
    
    //define it to be empty
    let existingUser;

    try{
        existingUser = await User.findOne({email : email});
    } catch(err){
        console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message: "User already exist! Login Instead"})
    }
    //store the hashpassword

    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name, //name: name, 
        email, //email : email, 
        password: hashedPassword, //password: password
    });

    try{
        //this is to save the document in the database
        await user.save();
    } catch(err){
        console.log(err);
    }
    //this is return just created
    return res.status(201).json({message: user})

}

//another middleware
const login = async (req, res, next) =>{
    const {email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    } catch(err){
        return new Error(err);
    }

    if(!existingUser){
        return res.status(400).json({message: "User not found. Signup Please"})
    }
    //compare the password to check 
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: 'Invalid Email/ Password'})
    }
    //after the password is correct, generate the token to user
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30s'
    });

    res.cookie(String(existingUser._id), token, {
        path: '/', 
        expires : new Date(Date.now() + 1000 * 30), 
        httpOnly: true, 
        sameSite: 'lax'
    });

    return res
        .status(200)
        .json({message: 'Successfully Logged In', user:existingUser, token});
};

//another middleware
const verifyToken = (req, res, next)=>{
    const cookies = req.headers.cookie;
    //this means split at the = sign and get the first index
    const token = cookies.split("=")[1];

    if(!token){
        res.status(404).json({message: "No token found"})
    }
    //verify the token
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(400).json({message: "Invalid Token"});
        }
        //console.log(user.id);
        req.id = user.id;
    });
    next();
};


//middleware
const getUser = async (req, res, next)=>{
    const userId = req.id;
    let user;
    try{
        //get all the details instead of the password
        user = await User.findById(userId, "-password");
    } catch(err){
        return new Error(err)
    }

    if(!user){
        return res.status(404).json({message: "User Not found"})
    }
    //send back the user 
    return res.status(200).json({user});
}
// const refreshToken = (req, res, next) => {
//     const cookies = req.headers.cookie;
//     //this means split at the = sign and get the first index
//     const prevtoken = cookies.split("=")[1];
//     if(!prevtoken){
//         return res.status(400).json({message: "Couldnnt find token"})
//     }
//     jwt.verify((String(prevtoken), JWT_SECRET_KEY, (err, user)=>{
//         if(err){
//             console.log(err);
//             return res.status(403).json({message: "Authetication failed"})
//         }
//         res.clearCookie(`${user.id}`)
//         req.cookies[`${user.id}`] = "";

//         const token = jwt.sign({id: user.id}, JWT_SECRET_KEY, {
//             expiresIn: "30s"
//         })
//         res.cookie(String(user.id), token, {
//             path: '/', 
//             expires : new Date(Date.now() + 1000 * 30), 
//             httpOnly: true, 
//             sameSite: 'lax'
//         });

//         req.id = user.id;
//         next();
//     }))
// };

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser; 
// exports.refreshToken = refreshToken;
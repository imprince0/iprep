const express =require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/getuser');
const JWT_SECRET="gavnishIsAGoodBoy";
// ROUTE:1 create user using post "/api/auth/createuser".No login required
router.post('/createuser',[
        body('email','Invalid Email').isEmail(),
        body('name','Name contains at least three character').isLength({ min: 3 }),
        body('password','password contain at least 5 character').isLength({ min: 5 })
      
],async (req,res)=>{
    let success=false;
    // if there are errors and return the bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
// try block to create a user
    try {
        // check already user exist or not
    let user= await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success,error: "sorry user with this email is already exist"});
    }
// create user
//generating salt to add to password
const salt=await bcrypt.genSalt(10);
// storing hashed password in secPass
const secPass= await bcrypt.hash(req.body.password,salt);
// adding details to user into database
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data={
        user:{
            id: user.id
        }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authToken});
} catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured");
}
})


//ROUTE:2 ***********HERE USER WILL LOGIN : NO LOGIN REQUIRED *************/
router.post('/login',[
    body('email','Invalid Email').isEmail(),
    body('password',"password can not be blank ").exists()
],async (req,res)=>{
    let success=false;
// if there are errors and return the bad request
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({success, errors: errors.array() });
}
const {email,password}= req.body;
try {
    // check already user exist or not
  let user = await User.findOne({email});
if(!user){
    return res.status(400).json({success,error: "Invalid credential"});
}
const passwordCompare=await bcrypt.compare(password,user.password);
if(!passwordCompare){
    return res.status(400).json({success,error: "Invalid credential"});
}
const data={
    user:{
        id: user.id
    }
}
const authToken=jwt.sign(data,JWT_SECRET)
success=true;
    res.json({success,authToken});

} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server errer occured ");
}


});

// ROUTE 3: getuser by api/auth/getuser and login required
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        const userid=req.user.id;
        const user=await User.findById(userid).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errer occured ");
    }
})
module.exports=router;
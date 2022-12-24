const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/people');
const { registerValidation, loginValidation } = require('../validate')
const dotenv = require('dotenv')
dotenv.config()

const router = express.Router();

    


router.post('/register', async (req, res)=>{
    // lETS VAlidateTHE DATA BEFORE WE USE IT
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return res.status(400).send("Email already exist")


    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
  
    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id })  
    } catch (error) {
        res.status(400).send(error)  
    }
}); 




// LOGIN
router.post('/login', async (req, res)=> {
    // LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Checking if the email exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send("Email Not Found");


    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Passowrd');
    
    
    // Create and assign token
    const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);  
})





module.exports = router;
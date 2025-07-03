const express = require('express');
const router_login = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel') //note we will export only once for all files ok 
const jwt = require('jsonwebtoken'); 
const axios = require('axios')

router_login.post('/',async(req,res)=>{
    console.log(req.body)
    try{
        const requiredFields = ['email','Password','recaptchaToken'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if(missingFields.length > 0){
            return res.status(400).json({
                success:false,
                message:`Missing required fields: ${missingFields.join(', ')}`
            });
        }
        try{
        const recaptcharesponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
        {
            params:{
                secret : "PUT_KEY_HERE",
                response : req.body.recaptchaToken
            }
        })
        if (!recaptcharesponse.data.success) {
            return res.status(400).json({
                success: false,
                message: "CAPTCHA verification failed"
            });
        }
        }
        catch(err){
            console.log(err)
            return res.status(500).json({
                success:false,
                message:"An unexpected error occurred"
            });
        }
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        const isMatch = await bcrypt.compare(req.body.Password,user.Password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });
        }
        const token_to_send = jwt.sign(
                    { userId: user._id, email: user.email }, 
                    process.env.JWT_SECURE_KEY 
                );
        
        return res.status(200).json({
            success:true,
            message:"Login successful",
            token: token_to_send
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"An unexpected error occurred"
        });
        
    }    
})

module.exports = router_login
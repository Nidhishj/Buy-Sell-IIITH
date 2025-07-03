const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel') //note we will export only once for all files ok 
const jwt = require('jsonwebtoken'); 
const axios = require('axios')
router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const requiredFields = ['first_name', 'last_name', 'email', 'age', 'Contact', 'Password','recaptchaToken'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
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
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        const hash_pwd = await bcrypt.hash(req.body.Password,11);
        req.body.Password = hash_pwd; 
        const user = new User(req.body);
        const token_to_send = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECURE_KEY 
        );
        console.log(token_to_send)
        await user.save();
        const userResponse = user.toObject();
        return res.status(201).json({
            success: true,
            token: token_to_send,
            data: userResponse
        });
    } catch (err) {
        console.log(err)
        if (err.errors?.email?.kind === 'regexp') {
            // console.log("makichut")
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid IIIT email id'
            });
        }

        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(400).json({
                success: false,
                message: 'Email ID already exists'
            });
        }

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(error => error.message);
            console.log(messages)
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        console.error('Signup Error:', err);
        
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred'
        });
    }
});

router.put('/change',async(req,res)=>{
    try{

        console.log(req.body)
        const user = await User.findOne({email:req.body.email})
        if(!user)
        {
            console.log("PLS CHECK SHIT HAPPENING")
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        console.log(req.body)
        //mp password nhi aa rha somehow 
        //dekh if pwd nhi h to ignore kr do na bc
        if(req.body?.Password)
        {const hash_pwd = await bcrypt.hash(req.body.Password,11);
        req.body.Password = hash_pwd;}
        //we only have to care for the pwd as it has to be hashed rest all update acc
        const token_to_send=jwt.sign(
        {userId:user._id,email:user.email},
        process.env.JWT_SECURE_KEY
        )

        await User.findOneAndUpdate({email:req.body.email},req.body)
        return res.status(200).json({
            success:true,
            token:token_to_send,
            message:"User d"
        })
    }
    catch(err)
    {
        console.log(err)
    }
}
)


router.get('/login' ,async(req,res)=>
{

    console.log(req)
    try{
        const user = await User.find()
        res.status(200).json({
            success:true,
            data:user
        })}
    catch(err)
    {
        console.log(err)
    }
    }
)


module.exports = router 
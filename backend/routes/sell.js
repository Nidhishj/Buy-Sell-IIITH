const express = require('express');
const sell_router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel') //note we will export only once for all files ok
const Item = require('../models/itemModel')
const Order = require('../models/orderModel') 
const jwt = require('jsonwebtoken'); 
const verify = require('../middleware/verify')

sell_router.post('/add', async (req,res)=>{
    console.log(req.body)
    try{

    const {name,seller_email,description,price,category,image} = req.body

    const user = await User.findOne({email:seller_email})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User does not exist"
        })}
    const item = new Item({name,seller_email,description,price,category,image})
    const item_saved = item.toObject()
    await item.save()
    console.log(item_saved)
    return res.status(200).json({
        success:true,
        data:item_saved
    })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })  
    }   
})


sell_router.get('/',verify,async (req,res)=>{
    console.log(req.header)
    console.log(req.query)
    try{
        const item = await Item.find({seller_email:req.query.email})
        const user = await User.findOne({ email: req.query.email });
        const response = item.map(item => ({
            ...item.toObject(),
            first_name: user.first_name,
            last_name: user.last_name
        }));
        console.log(response)
        return res.status(200).json(response)
    }
    catch(err){
        console.log(err)    
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })  
    }
})
module.exports = sell_router
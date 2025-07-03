const express = require('express')
const deliver_router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const Item = require('../models/itemModel')
const Order = require('../models/orderModel')
const jwt = require('jsonwebtoken'); 
const verify = require('../middleware/verify')

deliver_router.get('/',verify,async(req,res)=>{
    try{
        console.log("shreyansh bhai OP")
        console.log( "djfioasfbafb o ",req.header('auth-token')) 
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        console.log("WELCOME TO DELIVER",token)
        const verified = jwt.verify(token,process.env.JWT_SECURE_KEY);
        console.log("verified",verified)
        const order = await Order.find({seller_id:verified.email,status:"pending"})
        console.log(order)
        const response = order.map(order=>({
            ...order.toObject()
        }))
        for(let i = 0 ; i < order.length ; i ++)
        {
            const item = await Item.findOne({_id:order[i].item_id})
            response[i].name = item.name
            response[i].description = item.description
            response[i].price = item.price
            response[i].image = item.image
        }
        for(let i = 0 ; i < response.length;i++)
        {
            const buyer = await User.findOne({email:response[i].buyer_id})
            console.log("BUYER",buyer)
            response[i].buyer_name = buyer.first_name + " " + buyer.last_name
        }
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

deliver_router.post('/otp',async(req,res)=>{
    try{
        const {order_id,otp} = req.body
        console.log("OTP",otp)
        const order = await Order.findById(req.body.order_id)
        console.log("ORDER",order)
        if(!order.otp)
        {
            return res.status(200).json({
                success:false,
                message:"OTP not generated"
            })
        }
        if(otp==order.otp)
        {
            console.log("lnajkdnio")
            order.status = "completed"
            await order.save()
            return res.status(200).json({
                success:true,
                message:"OTP verified"
            })
        }
        else{
            return res.status(200).json({
                success:false,
                message:"Wrong OTP"
            })

    }
}
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
})
module.exports = deliver_router
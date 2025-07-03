const express = require('express');
const buy_router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel') //note we will export only once for all files ok
const Item = require('../models/itemModel')
const Order = require('../models/orderModel') 
const jwt = require('jsonwebtoken'); 
const verify = require('../middleware/verify')


buy_router.get('/',verify,async(req,res)=>{
    try{
        const token = req.header('auth-token');
        console.log("BUYYYYYYYYYYYY",token)
        const verified = jwt.verify(token,process.env.JWT_SECURE_KEY);
        let item = await Item.find() 
        item = item.filter(item=>item.sold!==true&&item.seller_email!==verified.email) //we now have those which are not sold
        const orders = await Order.find({buyer_id:verified.email})
        const order_items = orders.map(order=>order.item_id)
        console.log(order_items)   
        item = item.filter(item=>!order_items.includes(item._id))
        const response = item.map(item=>({
            ...item.toObject()
        }))
        for(let i = 0 ; i < response.length;i++)
        {
            const seller = await User.findOne({email:response[i].seller_email})
            response[i].first_name = seller.first_name
            response[i].last_name = seller.last_name    
            response[i].Contact = seller.Contact
        }
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


module.exports = buy_router
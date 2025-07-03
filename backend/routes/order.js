const express = require('express')
const order_router = express.Router()
const User = require('../models/userModel')
const Item = require('../models/itemModel')
const Order = require('../models/orderModel')



order_router.post('/add',async(req,res)=>{
    try{
        console.log("ajsdioaod addddddd")
        console.log(req.body)
        const {email,items} = req.body
        for(let i = 0 ; i < items.length;i++)
        {
            const Item_ordered = await Item.findOne({_id:items[i]._id})
            console.log("ITEM ORDERED",Item_ordered)
            console.log("SELLER?",Item_ordered.seller_email)
            Order.create({
                buyer_id:email,
                item_id:items[i]._id,
                status:"pending",
                seller_id:Item_ordered.seller_email,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Order placed successfully"
        })
    }
    catch(err)
    {   
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }   
})




order_router.post('/otp',async(req,res)=>{
    try{
        console.log("WELCOME TO OTP",req.body)
        const {order_id,otp} = req.body
        const order = await Order.findOneAndUpdate({_id:order_id},{otp:otp})
        return res.status(200).json({
            success:true,
            message:"OTP added successfully"
        })
    }catch(err){
        console.log(err)
    }
}
)

order_router.get('/pending',async(req,res)=>{
    try{
        console.log("WELCOME TO PENDING",req.query.email)
                const user = await User.findOne({email:req.query.email})

        const orders = await Order.find({buyer_id:req.query.email})
        console.log(orders)
        let items = []
        let order_ids = []
        for(i = 0 ; i < orders.length;i++)
        {
            if(orders[i].status === "pending")
            {items.push(orders[i].item_id)
                order_ids.push(orders[i]._id)
            }
        }
        for(let i = 0 ; i < items.length;i++)
            {
                const   item = await Item.findOne({_id:items[i]})
                const user2= await User.findOne({email:item.seller_email})
                
                items[i] = {
                    ...item.toObject(),                    
                    order_id:order_ids[i],
                    first_name : user2.first_name,
                    last_name : user2.last_name
                }
            }
            console.log("FINALLLL",items)
            return res.status(200).json(items)
        // return res.status(200).json(orders)        
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
})

order_router.get('/bought',async(req,res)=>{
    try{
        console.log("qUERY",req.query.email)
        console.log("WELCOME TO boughht",req.query.email)
                const user = await User.findOne({email:req.query.email})

        const orders = await Order.find({buyer_id:req.query.email})
        console.log(orders)
        let items = []
        let order_ids = []
        let seller_emails = []
        let reviews = []
        console.log(orders)
        for(i = 0 ; i < orders.length;i++)
        {
            if(orders[i].status === "completed")
            {items.push(orders[i].item_id)
                order_ids.push(orders[i]._id)
                seller_emails.push(orders[i].seller_id)
                reviews.push(orders[i].review)
            }
        }
        for(let i = 0 ; i < items.length;i++)
            {
                const   item = await Item.findOne({_id:items[i]})
                const user2= await User.findOne({email:item.seller_email})
                
                items[i] = {
                    ...item.toObject(),                    
                    order_id:order_ids[i],
                    review:reviews[i],
                    first_name : user2.first_name,
                    last_name : user2.last_name,
                    seller_email : seller_emails[i]
                }
            }
            console.log("FINALLLL",items)
            return res.status(200).json(items)
        // return res.status(200).json(orders)        
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
})

order_router.get('/sold',async(req,res)=>{
    try{
        console.log("qUERY",req.query.email)
        console.log("WELCOME TO sold",req.query.email)
                const user = await User.findOne({email:req.query.email})

        const orders = await Order.find({seller_id:req.query.email})
        console.log(orders)
        let items = []
        let order_ids = []
        let buyers= []
        console.log(orders)
        for(i = 0 ; i < orders.length;i++)
        {
            if(orders[i].status === "completed")
            {items.push(orders[i].item_id)
                order_ids.push(orders[i]._id)
                buyers.push(orders[i].buyer_id)
            }
        }
        
        for(let i = 0 ; i < items.length;i++)
            {
                const   item = await Item.findOne({_id:items[i]})
                // console.log("BUEUR",items[i].buyer_id)
                const user2= await User.findOne({email:buyers[i]})
                
                items[i] = {
                    ...item.toObject(),                    
                    order_id:order_ids[i],
                    first_name : user2.first_name,
                    last_name : user2.last_name
                }
            }
            console.log("FINALLLL",items)
            return res.status(200).json(items)
        // return res.status(200).json(orders)        
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
})

order_router.post('/rate',async(req,res)=>{
    try{
        console.log("PAGAKKKKKKKKK",req.body)
        await Order.findOneAndUpdate({_id:req.body.order_id},{review:req.body.rating})
        console.log("SELLER",req.body.seller_email)
        const user = await User.findOne({email:req.body.seller_email})
        console.log("USER",user)
        if(user.Review)
        {
            user.Review = (user.Review*(user.Rated_by)+req.body.rating)/(user.Rated_by+1)
            user.Rated_by = user.Rated_by+1
        }
        else{
            user.Review = req.body.rating
            user.Rated_by = 1
        }
        
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Rating added successfully"
        })
    }catch(err){
        
    }
})


module.exports = order_router
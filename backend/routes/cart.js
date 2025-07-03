const express = require('express')
const cart_router = express.Router()
const User = require('../models/userModel')
const Item = require('../models/itemModel')



cart_router.post('/add',async(req,res)=>{
    try {
        //so we have to get the user which has added 
        //also the item_id would suffice 
        console.log("BAKCHODI ? ")
        console.log(req.body.email)
        const {email,item_id} = req.body
        await User.findOneAndUpdate({email:email},{$push:{Items_to_buy:item_id}})
        const response = await User.findOne({email:email})
        console.log(response)
        return res.status(200).json({
            success:true,
            data:response
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


cart_router.get('/',async(req,res)=>{
    try{
        const user = await User.findOne({email:req.query.email})
        console.log(user.Items_to_buy)
        const items = await Item.find({_id:{$in:user.Items_to_buy}})
        console.log(items)  
        return res.status(200).json(items)
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }   
}
)

cart_router.delete('/delete',async(req,res)=>{
    try{
        console.log(req.body)
        console.log("DELELETE HOOOOO")
        const userr = await User.findOne({email:req.body.email})
        console.log(userr)
        userr.Items_to_buy = userr.Items_to_buy.filter(item=>item!==req.body.item_id)
        await User.findOneAndUpdate({email:req.body.email},{$set:{Items_to_buy:userr.Items_to_buy}})
        const response = await User.findOne({email:req.body.email})
        console.log(response)
        return res.status(200).json({
            success:true,
            data:response
        })
    }
    catch(err){
        console.log(req.body)
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Internal server error"
        })
       }
   }
)

cart_router.put('/empty',async(req,res)=>{
    try{
        console.log(req.body)
        const userr = await User.findOne({email:req.body.email})
        userr.Items_to_buy = []
        await User.findOneAndUpdate({email:req.body.email},{$set:{Items_to_buy:userr.Items_to_buy}})
        const response = await User.findOne({email:req.body.email})
        console.log(response)
        return res.status(200).json({
            success:true,
            data:response
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


module.exports = cart_router
const express = require('express')
const item_router = express.Router()    
const Item = require('../models/itemModel')
const User = require('../models/userModel')
const verify = require('../middleware/verify')


item_router.get('/',async(req,res)=>{
    try{

        console.log("WELCOME TO ITEMSSSS")
        console.log(req.query)
        const item = await Item.findOne({_id: req.query.id})
        const user = await User.findOne({email:req.query.email})

        let presenti = user?.Items_to_buy?.includes(req.query.id) ?? false;

        console.log(user.email)
        console.log(presenti)
        const seller_details = await User.findOne({email:item.seller_email})
        
        item.seller_name = seller_details.first_name + " " + seller_details.last_name
        item.present = presenti
        item.Contact = seller_details.Contact
        console.log("WTF?",item.present)
        item_check = item.toObject()
        console.log("CHECKKKK",item_check)
        item_check.present = presenti
        item_check.seller_name = seller_details.first_name + " " + seller_details.last_name 
        item_check.Contact= seller_details.Contact
        console.log("{aksdoaj",item_check.present)

        const response = {
            item:item_check,   
        }    

        // console.log(response)
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

module.exports = item_router
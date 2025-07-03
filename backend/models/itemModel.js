const {Schema,model} = require('mongoose')

const itemSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxlength:100
    },
    seller_email:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    sold:{
        type:Boolean,
        default:false
    }
})  


const Itemmodel = model('Item',itemSchema)

module.exports = Itemmodel
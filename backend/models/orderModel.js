const {Schema,model} = require('mongoose')

const orderSchema = new Schema({
    item_id:{
        type:String,
        required:true
    },
    buyer_id:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        default:null
    },
    status:{
        type:String,    
        default:"pending"
    },
    Serial_no:{
        type:Number,
        increment:true
    },
    review:{
        type:Number,
        default:0    
    },
    seller_id:{
        type:String,
        default:null
    }
})

const Ordermodel = model('Order',orderSchema)
module.exports = Ordermodel 

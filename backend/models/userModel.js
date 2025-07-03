const {Schema,model} = require('mongoose')


const userSchema = new Schema({
    first_name:{
        type:String,
        required:true,
        maxlength:100
    },
    last_name:{
        type:String,
        required:true,
        maxlength:100
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: /iiit\.ac\.in$/
    },
    age:{
        type:Number,
        required:true
    },
    Contact:{
        type:Number,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
    Items:{
        type:Array,
        default:[]
    },
    Review:{
        type:Number,
        default:null
    },
    Rated_by:{
        type:Number,
        default:0
    },
    Items_to_buy:{ 
        type:Array,
        default:[] //not the one whoo are not ordered but those who are in cart
    },  
})

const   Usermodel = model('User',userSchema)

module.exports = Usermodel 

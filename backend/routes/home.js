const express = require('express');
const router_home = express.Router()
const User = require('../models/userModel') //note we will export only once for all files ok 
const verify = require('../middleware/verify')



router_home.get('/',verify,async(req,res)=>{
    // console.log(req);
  const user = await User.findById(req.user.userId);
  // console.log(user)
    res.json({
        success:true,
        person:user,
        message:"Welcome to the home page",}
    );
})
module.exports = router_home
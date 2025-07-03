const jwt = require("jsonwebtoken")

function verify(req,res,next) {
    console.log("aagaye bhai ? ")
    console.log(req.header('auth-token'))
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Access denied"
        });
    }
    try{
        const verified = jwt.verify(token,process.env.JWT_SECURE_KEY);
        // console.log(verified);
        req.user=verified;
        console.log("verified",verified)
        next();
    }catch(err){
        console.log(err)    
        return res.status(400).json({
            success:false,
            message:"Invalid token"
        });
    }
}

module.exports = verify
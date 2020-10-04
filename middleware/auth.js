const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.cookies.access_token
        if(!authHeader){
            res.redirect('/login')         
        }  
     
    try{      
        const payload = jwt.verify(req.cookies.access_token, secret);
        
    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            console.log(error);
            res.redirect('/login')
        }
        if(error instanceof jwt.JsonWebTokenError){
            console.log(error);
            res.redirect('/login')
        }
    }
    next()
};
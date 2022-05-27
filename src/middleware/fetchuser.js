const jwt = require("jsonwebtoken")
const key = "mynameisayushjainandishujain";
const User = require("../models/User")

const fetchuser = async(req,res,next)=>{

    try{

        const token = req.header('auth-token'); // get the token from header;

        if(!token)
        {
            res.status(401).send({error:"Please authenticate using a valid token"});
        }

        
        const data = jwt.verify(token,key)

       
     
        req.user = data.user;
        next();


    }catch(e)
    {
        //console.log(e);
        res.status(401).send({error:"Error some code"});
    }


}

module.exports = fetchuser;
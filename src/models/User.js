const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const validator = require('validator');
const userData = mongoose.Schema({


    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:20,
    },

    email:{
        type:String,
        required:true,
        unique: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("envalid email");
            }

        }
        
    },

    password:{

        type: String,
        required: true,
        minlength:5,
        maxlength:15,
    },

    date:{

        type: Date,
        default: Date.now,
    }


    



})



// converting hpassword into hash
userData.pre("save",async function(next){

    //const passwordHASH = await bcrypt.hash(password,13);
    
    if(this.isModified("password"))
    {
        
         //const passwordHASH = await bcrypt.hash(password,13);
        this.password = await bcrypt.hash(this.password,12);

   

    }

    next()


})


const User = new  mongoose.model("User",userData);
User.createIndexes();

module.exports = User;
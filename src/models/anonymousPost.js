const mongoose = require('mongoose')

const AnonymouspostSchema = mongoose.Schema({


    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'


    },
    name: {

        type: String,
        default: "Anonymous"



    },
    description: {
        type: String,
        min: 10,
        max: 500,
        required: true

    },
    comments: [
        {

            user: {

                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'


            },
            comment:{
                type:String,
                required:true,
                minlength:[10,"Comment should not be empty and"],
            },
            name:{
                type:String,
                default:"Anonymous",
                required:true
            }
        }

    ],

    date: {

        type: Date,
        default: Date.now,
    }






})






const Anonymouspost = new mongoose.model("Anonymouspost", AnonymouspostSchema);


module.exports = Anonymouspost;
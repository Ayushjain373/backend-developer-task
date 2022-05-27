const mongoose = require('mongoose')

const postSchema = mongoose.Schema({


    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'


    },
    name: {

        type: String,



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
                required:true
            }
        }

    ],

    date: {

        type: Date,
        default: Date.now,
    }






})






const Post = new mongoose.model("Post", postSchema);


module.exports = Post;
const express = require('express');
const app = express();
const User = require("../src/models/User")
const router = express.Router()
const Anonymouspost = require("../src/models/anonymousPost")
const fetchuser = require("../src/middleware/fetchuser")


app.use(express.json());
/// post a thought
router.post("/addanonymouspost", fetchuser, async (req, res) => {
    try {





        const newpost = new Anonymouspost({

            user: req.user.id,
          
            description: req.body.description,
        })
        const result = await newpost.save();
        res.json(result)






    } catch (error) {
        console.log(error)
        res.status(404).send(error);

    }



})

// fetch all posts
router.get('/fetchanonymouspost', fetchuser, async (req, res) => {

    try {
        const allData = await Anonymouspost.find({ user: req.user.id });

        res.json(allData)
    } catch (error) {

        console.log(error)

        res.send(error);

    }
})



/// post a comments


router.post('/comments/:id', fetchuser, async (req, res) => {
    try {

      

         
          
        
        const userpost = await Anonymouspost.findById({ _id: req.params.id });

        const newComments = {
            comment: req.body.comment,
           
            user: req.user.id


        }

        userpost.comments.unshift(newComments)// jo post schema ke aandar comments ka array hai uske andar ye unshift methods newcomments add krdega

        const result = await userpost.save()
        res.status(200).send(result)

    } catch (error) {

        console.log(error);
        res.status(500).send("Internal error")

    }


})


// delet a comment

router.delete('/commentdel/:id/:comment_id', fetchuser, async (req, res) => {


    try {
        const post = await Anonymouspost.findById(req.params.id);


        const comment = post.comments.find(comment => comment._id == req.params.comment_id)
        console.log(comment)

        if (!comment) {
            return res.status(404).json({ "msg": "Comment not found" })
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed user not authenticate");
        }

        post.comments = post.comments.filter(({ comment }) => comment._id !== req.params.comment_id)
        console.log(post.comments)
        const result = await post.save();
        return res.status(200).send("comment deleted")
    } catch (err) {
        console.log(err)
        res.status(500).send("Internal server error")
    }




})



// delet a post

router.delete("/deleteanonymouspost/:id", fetchuser, async (req, res) => {

    // verify the user first

    //find the note to be delete and delete it

    try {

        let post = await Anonymouspost.findById({ _id: req.params.id });
        if (!post) {
            return res.status(404).send("Post Not found");
        }

        //Allow user only if owns this note
        if (post.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        post = await Anonymouspost.findByIdAndDelete({ _id: req.params.id });
        res.json({ "Success": "Not has been deleted" })


    } catch (error) {

        res.status(500).send(error)

    }


})



module.exports = router
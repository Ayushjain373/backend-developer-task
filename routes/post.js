const express = require('express');
const app = express();
const User = require("../src/models/User")
const router = express.Router()
const Post = require("../src/models/Post")
const fetchuser = require("../src/middleware/fetchuser")
const validator = require('validator')

app.use(express.json());
/// post a thought
router.post("/addPost", fetchuser, async (req, res) => {





  try {

    const userDetails = await User.findById({ _id: req.user.id });


    if (userDetails) {
      const newpost = new Post({

        user: req.user.id,
        name: userDetails.name,
        description: req.body.description,
      })
      const result = await newpost.save();
      res.json(result)

    } else {

      res.status(500).send({ error: "User not found" });
    }




  } catch (error) {
    res.status(404).send(error);

  }



})

// fetch all posts
router.get('/fetchPost', fetchuser, async (req, res) => {

  try {
    const allData = await Post.find({ user: req.user.id });

    res.json(allData)
  } catch (error) {

    res.send(error);

  }
})



/// post a comments


router.post('/comments/:id', fetchuser, async (req, res) => {
  try {

    const userDetails = await User.findById({ _id: req.user.id }).select('-password');

    if (!userDetails) {
      return res.send(404).send("User not found")
    }
    const userpost = await Post.findById({ _id: req.params.id });

    const newComments = {
      comment: req.body.comment,
      name: userDetails.name,
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
    const post = await Post.findById(req.params.id);


    const comment =  post.comments.find(comment => comment._id == req.params.comment_id)
    console.log(comment)

    if (!comment) {
      return res.status(404).json({ "msg": "Comment not found" })
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed user not authenticate");
    }

    post.comments = post.comments.filter(({comment }) =>comment._id !== req.params.comment_id)
    console.log(post.comments)
    const result = await post.save();
    return res.status(200).send("comment deleted")
  }catch(err)
  {
    console.log(err)
      res.status(500).send("Internal server error")
  }




})



// delet a post

router.delete("/deletePost/:id", fetchuser, async (req, res) => {

  // verify the user first

  //find the note to be delete and delete it

  try {

    let post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(404).send("Post Not found");
    }

    //Allow user only if owns this note
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    post = await Post.findByIdAndDelete({ _id: req.params.id });
    res.json({ "Success": "Not has been deleted" })


  } catch (error) {

    res.status(500).send(error)

  }


})



module.exports = router
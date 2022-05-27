const express = require('express');
const User = require("../src/models/User")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const key = "mynameisayushjainandishujain";
const fetchuser  = require("../src/middleware/fetchuser");


// create a user using POST "/api/auth"
router.post('/createuser', async (req, resp) => {

    let success = false;

    try {

        const registerUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,


        });


        const data = {

            user: {
                id: registerUser.id,
            }
        }

        // create the token wheen user signup
        const authtoken = jwt.sign(data,key )
        


     





        const result = await registerUser.save();
        resp.json({success:true, authtoken});


    } catch (err) {
        console.log(err)
        resp.json({ success,error: "Please enter a unique value for email" })

    }
})




//// router for login 
router.post('/login', [

    body('email', "enter a valid email").isEmail(),
    body('password', "Password can't be blank").exists(),

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;
     let success = false;

    try {

        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ error: "Sorry Please enter the right credentials" });
        }



        const passwordComp = await bcrypt.compare(password, user.password);

        if (!passwordComp) {
            success=false;
            res.status(400).json({ success,error: "Sorry Please enter the right credentials" });
        }

        const data = {

            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, key)
        //console.log(authtoken)

        success = true;

        res.json({ success,authtoken })

    } catch (error) {

        console.log(error);

        res.status(500).send("Error some code")

    }




})


/// route 3 get logged inn user details


router.post('/getuser',fetchuser, async (req, res) => {



    try {


        const userid = req.user.id


        const user = await User.findById({_id:userid}).select("-password");

        res.send(user);

    } catch (error) {


        console.log(error);

        res.status(500).send("Error some code")

    }




})



module.exports = router
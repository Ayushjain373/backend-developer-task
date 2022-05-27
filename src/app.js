const express = require("express")
const app = express()

const port = process.env.PORT || 8000

require("../src/db/dbconnection") 

app.use(express.json()) // it a body parser when you gonna make post request it will help
app.use(express.urlencoded({ extended: false }))//important line

// signup routes and login routes
app.use('/api/user', require('../routes/auth'))
app.use('/api/posts',require("../routes/post"))
app.use('/api/anonymous/',require("../routes/Anonymouspost"))
app.get("/",(req,res)=>{


    res.send("Hello")
})


app.listen(port, () => {

    console.log(`server is running at ${port}`);
})
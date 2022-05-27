const mongoose = require('mongoose')


mongoose.connect(`mongodb://localhost:27017/Post`,
{ useNewUrlParser: true,
useUnifiedTopology: true,
//useFindAndModify:false
}).then(()=>{

    console.log("connection is succesfull")
}).catch((e)=>{
    console.log("No connection")
})
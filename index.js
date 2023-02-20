const express = require("express")
const {connection} = require("./config/db")
const {authentication} = require("./middlewares/authenticate.middlewares")
const cors = require('cors')
require("dotenv").config()


const {UserRouter} = require("./routes/user.routes")
const {postRouter} = require("./routes/post.routes")
const app = express();

app.use(express.json());
app.use("/users",UserRouter)
app.use(authentication)
app.use("/posts",postRouter)
app.use(cors)
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running at ${process.env.PORT}`)
})


// "name" : "Dhirendra Singh",
//     "email" : "dj@gmail.com",
//     "gender" : "Male",
//     "password" : "dj333",
//     "age" : 20,
//     "city" : "Jodhpur"
    
//     {
//    "title":"Kahani Suno",
//    "body":"my favourite song",
//    "device":"Mobile",
//    "no_of_comments":87
// }
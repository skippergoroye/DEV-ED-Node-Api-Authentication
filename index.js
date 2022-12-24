const express = require('express');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()



const app = express()
const PORT = process.env.PORT


// connect To DB
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URI)
.then(()=>{
    console.log(`Database connected successfully`)
}).catch((error)=>{
    console.log(error)
})



// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))





//Routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);






app.listen(PORT, () => {
    console.log(`Server Up and running on ${PORT}`)
})
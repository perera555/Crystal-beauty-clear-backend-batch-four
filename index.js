import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userRouter from './routes/userRouter.js'
import jwt from 'jsonwebtoken'
import productRouter from './routes/productRoute.js'
import verifyJWT from './middleware/auth.js'
import orderRouter from './routes/orderRoute.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

// DATABASE
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connect to the Database Successfully")
})
.catch(()=>{
    console.log("Error to connect to Database")
})


// USER ROUTES (NO JWT REQUIRED)
app.use("/api/user", userRouter)


// PROTECTED ROUTES
app.use("/api/product", verifyJWT, productRouter)
app.use("/api/order", verifyJWT, orderRouter)


app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})
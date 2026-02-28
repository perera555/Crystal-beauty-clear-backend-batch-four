import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken'
import productRouter from './routes/productRoute.js';

import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRoute.js';
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'


const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use(verifyJWT)

mongoose.connect(process.env.MONGO_URL)
    .then(
        () => {
            console.log("Connect to the Database Successfully")
        }
    )
    .catch(
        () => {
            console.log("Error to connect to Database")
        }
    )

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/order",orderRouter )

app.listen(5000, () => {
    console.log("Server runing on port 5000")
})
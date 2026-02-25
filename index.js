import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken'
import prodductRouter from './routes/productRoute.js';
import verifyJWT from './middleware/auth.js';
import orderRouter from './routes/orderRoute.js';


const app = express();
app.use(bodyParser.json());

app.use(verifyJWT)

mongoose.connect("mongodb+srv://admin:123@cluster0.d78l82j.mongodb.net/?appName=Cluster0")
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
app.use("/api/product", prodductRouter)
app.use("/api/order",orderRouter )

app.listen(5000, () => {
    console.log("Server runing on port 5000")
})
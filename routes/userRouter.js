import express from "express"
import { getCurrentUser, googleLogin, loginUser, saveUser, sendOTP, resetPassword } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",saveUser)

userRouter.post("/login",loginUser)

userRouter.post("/google",googleLogin)

userRouter.get("/current",getCurrentUser)

userRouter.post("/sendOTP",sendOTP)

userRouter.post("/resetPassword",resetPassword)

export default userRouter
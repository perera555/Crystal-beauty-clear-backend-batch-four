import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";

dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export function saveUser(req, res) {

    if (req.body.role == "admin") {

        if (req.user == null) {
            return res.status(403).json({
                message: "Please Login to Create Admin User"
            });
        }

        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "Only Admin User can Create Admin User"
            });
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role
    });

    user.save()
        .then(() => {
            res.json({
                message: "User Saved Successfully"
            });
        })
        .catch(() => {
            res.status(500).json({
                message: "Error Saving User"
            });
        });
}



export function loginUser(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {

            if (user == null) {
                return res.status(404).json({
                    message: "Invalid Email"
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (isPasswordCorrect) {

                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                };

                const token = jwt.sign(userData, process.env.JWT_KEY, {
                    expiresIn: "48h"
                });

                res.json({
                    message: "Login Successfully",
                    token: token,
                    user: userData
                });

            } else {

                res.status(403).json({
                    message: "Invalid Password"
                });

            }

        });
}



export async function googleLogin(req, res) {

    const accessToken = req.body.accessToken;

    try {

        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }
        );

        const user = await User.findOne({
            email: response.data.email
        });

        if (user == null) {

            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                password: accessToken
            });

            await newUser.save();
        }

        res.json({
            message: "Google Login Success"
        });

    } catch (e) {

        res.status(500).json({
            message: "Google login failed"
        });

    }
}



export function getCurrentUser(req, res) {

    if (req.user == null) {

        return res.status(403).json({
            message: "Please login"
        });

    }

    res.json({
        user: req.user
    });
}



export function sendOTP(req, res) {

    const email = req.body.email;

    const otp = Math.floor(Math.random() * 9000) + 1000;

    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for password reset",
        text: "Your OTP is : " + otp
    };

    transport.sendMail(message, (err) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                message: "Error Sending Email"
            });

        } else {

            res.json({
                message: "OTP sent Successfully",
                otp: otp
            });

        }

    });

}



export async function resetPassword(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        user.password = hashedPassword;

        await user.save();

        res.json({
            message: "Password Reset Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Password reset failed"
        });

    }
}
//app pw-rcdt kyfa tpcr ovri
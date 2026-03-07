import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import axios from "axios";
dotenv.config()

export function saveUser(req, res) {

    if (req.body.role == "admin") {
        if (req.user == null) {
            res.status(403).json({
                message: "Please Login to Create Admin User"
            })
            return
        }
        if (req.user.role != "admin") {
            res.status(403).json({
                message: "Only Admin User can Create Admin User"
            })
            return
        }


    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role,

    })

    user.save()
        .then(() => {
            res.status(200).json({
                message: "User Saved Successfully"
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error to Saved User"

            })
        })


}
export function loginUser(req, res) {

    const email = req.body.email
    const password = req.body.password

    User.findOne({
        email: email

    }).then(
        (user) => {
            if (user == null) {
                res.status(404).json({
                    message: "Invalid Email"
                })

            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password)
                if (isPasswordCorrect) {

                    const userData = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        phone: user.phone,
                        isDisabled: user.isDisabled,
                        isEmailVerified: user.isEmailedVerified
                    }
                    const token = jwt.sign(userData, process.env.JWT_KEY, {
                        expiresIn: "48hrs"
                    })

                    res.json({
                        message: "Login Successfully",
                        token: token,
                        user: userData
                    })

                } else {
                    res.status(403).json({
                        message: "Invalid Password"
                    })

                }
            }

        })

}
export async function googleLogin(req, res) {
    const accessToken = req.body.accessToken;

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })

        const user = await User.findOne({
            email: response.data.email

        })
        if (user == null) {
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                isEmailedVerified: true,
                password: accessToken
            })
            await newUser.save()
            const userData = {
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                isEmailedVerified: true,
                role: "user",
                phone: "Not Given",
                isDisabled: false,
                isEmailVerified: true
            }
            const token = jwt.sign(userData, process.env.JWT_KEY, {
                expiresIn: "48hrs"
            })

            res.json({
                message: "Login Successfully",
                token: token,
                user: userData
            })

        } else {
            const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone: user.phone,
                isDisabled: user.isDisabled,
                isEmailVerified: user.isEmailedVerified
            }
            const token = jwt.sign(userData, process.env.JWT_KEY, {
                expiresIn: "48hrs"
            })

            res.json({
                message: "Login Successfully",
                token: token,
                user: userData
            })


        }

    } catch (e) {
        res.status(500).json({
            message: "Google login failed"
        })
    }
}
export function getCurrentUser(req, res) {

    if (req.user == null) {
        return res.status(403).json({
            message: "Please login to user Details"
        });
    }

    res.json({
        user: req.user
    });
}
    



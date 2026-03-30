import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

// ================= EMAIL =================
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ================= REGISTER =================
export async function saveUser(req, res) {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 🔒 Admin protection
        if (role === "admin") {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({
                    message: "Only admin can create admin users"
                });
            }
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: role || "user"
        });

        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// ================= LOGIN =================
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Invalid Email" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(403).json({ message: "Invalid Password" });
        }

        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };

        const token = jwt.sign(userData, process.env.JWT_KEY, {
            expiresIn: "48h"
        });

        res.json({
            message: "Login successful",
            token,
            user: userData
        });

    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
}

// ================= GOOGLE LOGIN =================
export async function googleLogin(req, res) {
    try {
        const { accessToken } = req.body;

        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const { email, given_name, family_name } = response.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                firstName: given_name,
                lastName: family_name,
                password: "GOOGLE_USER", // ✅ safe placeholder
                role: "user",
                isEmailVerified: true
            });

            await user.save();
        }

        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };

        const token = jwt.sign(userData, process.env.JWT_KEY, {
            expiresIn: "48h"
        });

        res.json({
            message: "Login successful",
            token,
            user: userData   // ✅ FIXED
        });

    } catch (err) {
        res.status(500).json({
            message: "Google login failed",
            error: err.message
        });
    }
}

// ================= CURRENT USER =================
export function getCurrentUser(req, res) {
    if (!req.user) {
        return res.status(403).json({ message: "Please login" });
    }

    res.json({ user: req.user });
}

// ================= OTP =================
export async function sendOTP(req, res) {
    try {
        const { email } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);

        await OTP.create({ email, otp });

        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Code",
            text: `Your OTP is ${otp}`
        });

        res.json({ message: "OTP sent" });

    } catch {
        res.status(500).json({ message: "Email error" });
    }
}

// ================= CHANGE PASSWORD =================
export async function changePassword(req, res) {
    try {
        const { email, password, otp } = req.body;

        const lastOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!lastOTP || lastOTP.otp != otp) {
            return res.status(403).json({ message: "Invalid OTP" });
        }

        const hashed = bcrypt.hashSync(password, 10);

        await User.updateOne({ email }, { password: hashed });
        await OTP.deleteMany({ email });

        res.json({ message: "Password updated" });

    } catch {
        res.status(500).json({ message: "Error changing password" });
    }
}

// ================= ADMIN =================

// 🔒 protect these in router with verifyJWT + admin check
export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.json({ users });
    } catch {
        res.status(500).json({ message: "Error fetching users" });
    }
}

export async function updateUserRole(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            role: req.body.role
        });

        res.json({ message: "User updated" });

    } catch {
        res.status(500).json({ message: "Update failed" });
    }
}
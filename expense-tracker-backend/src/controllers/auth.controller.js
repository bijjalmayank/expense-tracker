import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../models/User.js";

/* =========================
   AUTH
========================= */

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* =========================
   PROFILE
========================= */

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("_id name email");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (email && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (name) user.name = name;
        await user.save();

        return res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* =========================
   PASSWORD
========================= */

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select("password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({ message: "Password updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* =========================
   FORGOT PASSWORD (BREVO)
========================= */

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        // Always respond fast (security + UX)
        res.json({ message: "If that email exists, an OTP was sent" });

        if (!user) return;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        // console.log("BREVO KEY PRESENT:", !!process.env.BREVO_API_KEY);
        // Send email via Brevo (background)
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    email: process.env.EMAIL_FROM,
                    name: "Expense Tracker",
                },
                to: [{ email: user.email }],
                subject: "Your Password Reset OTP",
                textContent: `Your OTP is ${otp}. It expires in 15 minutes.`,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        console.log("OTP email sent via Brevo to", user.email);
    } catch (err) {
        console.error("Brevo OTP error:", err.response?.data || err.message);
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select("resetOTP resetOTPExpires");
        if (!user) return res.status(400).json({ message: "Invalid OTP" });

        if (!user.resetOTP || user.resetOTPExpires < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        return res.json({ message: "OTP verified" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email }).select(
            "password resetOTP resetOTPExpires"
        );

        if (
            !user ||
            user.resetOTP !== otp ||
            user.resetOTPExpires < new Date()
        ) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        return res.json({ message: "Password updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

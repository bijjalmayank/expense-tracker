import { Router } from "express";
import {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyOTP,
    resetPassword,
} from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/test", (req, res) => {
    res.send("Auth route working fine");
});

router.post("/signup", signup);
router.post("/login", login);

// Protected profile routes
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/me/password", auth, changePassword);

// Forgot password flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;

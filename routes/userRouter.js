import express from "express";
import {
  saveUser,
  loginUser,
  googleLogin,
  getCurrentUser,
  sendOTP,
  changePassword,
  getAllUsers,
  updateUserRole
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", saveUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", getCurrentUser);
router.get("/current", getCurrentUser);
router.post("/sendOTP", sendOTP);
router.post("/changepassword", changePassword);

// ✅ ADMIN ROUTES
router.get("/", getAllUsers);
router.put("/:id", updateUserRole);

export default router;
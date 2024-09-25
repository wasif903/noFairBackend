import express from "express";
import {
  HandleForgotPassword,
  HandleGetAllUsers,
  HandleLogin,
  HandleResendOtp,
  HandleSignup,
  HandleUpdateProfile,
  HandleVerifyOtp
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/get-users", HandleGetAllUsers);

router.post("/signup", HandleSignup);

router.post("/login", HandleLogin);

router.patch("/update-profile/:userID", HandleUpdateProfile);

router.patch("/forget-password", HandleForgotPassword);

router.patch("/verify-otp", HandleVerifyOtp);

router.patch("/resend-otp", HandleResendOtp);

export default router;

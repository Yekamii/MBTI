// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import passport from "../auth/google.js";

const router = express.Router();

// FRONTEND URL (Render-safe)
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/register`,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/register`);
    }

    const payload = {
      id: req.user.id,
      google_id: req.user.google_id,
      email: req.user.email,
      name: req.user.name,
      photo: req.user.photo,
      mbtiType: req.user.mbti_type || "Unknown",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.redirect(
      `${FRONTEND_URL}/register?token=${token}`
    );
  }
);

export default router;
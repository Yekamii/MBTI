// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";

import articlesRoutes from "./routes/articles.js";
import pubmedRoutes from "./routes/pubmed.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";

import "./auth/google.js";

const app = express();

//  (local + production)
const allowedOrigins = [
  "http://localhost:3000",
  "https://mbti-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// static files
app.use("/images", express.static("public/images"));

app.use(passport.initialize());

// routes
app.use("/auth", authRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/pubmed", pubmedRoutes);
app.use("/api/chat-reply", chatRoutes);
app.use("/api/user", userRoutes);

// 👇 დაამატე მხოლოდ ეს
app.get("/", (req, res) => {
  res.send("MBTI Backend running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

//PORT (RENDER SAFE)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(` Server running on port ${PORT}`)
);
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

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/images", express.static("public/images"));

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/pubmed", pubmedRoutes);
app.use("/api/chat-reply", chatRoutes);
app.use("/api/user", userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
// routes/user.js
import express from "express";
import { pool } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== Get Profile ====================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      "SELECT id, email, photo, mbti_type FROM users WHERE id=$1",
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    // saved articles
    const articlesResult = await pool.query(
      `SELECT a.* 
       FROM saved_articles s
       JOIN articles a ON s.article_slug = a.slug
       WHERE s.user_id=$1`,
      [userId]
    );

    // saved MBTI results
    const resultsResult = await pool.query(
      `SELECT mbti_type 
       FROM mbti_results 
       WHERE user_id=$1 
       ORDER BY created_at ASC`,
      [userId]
    );

    res.json({
      ...user,
      savedArticles: articlesResult.rows,
      savedResults: resultsResult.rows.map(r => r.mbti_type)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== Save MBTI ====================
router.post("/mbti", verifyToken, async (req, res) => {
  try {
    const { mbtiType } = req.body;
    const userId = req.user.id;

    await pool.query(
      `INSERT INTO mbti_results (user_id, mbti_type)
       VALUES ($1,$2)`,
      [userId, mbtiType]
    );

    await pool.query(
      `UPDATE users SET mbti_type=$1 WHERE id=$2`,
      [mbtiType, userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== Delete MBTI ====================
router.delete("/mbti", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      "DELETE FROM mbti_results WHERE user_id=$1",
      [userId]
    );

    await pool.query(
      "UPDATE users SET mbti_type='Unknown' WHERE id=$1",
      [userId]
    );

    res.json({ savedResults: [] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= SAVE ARTICLE =================
router.post("/save-article", verifyToken, async (req, res) => {
  try {
    const { article } = req.body;
    const userId = req.user.id;

    await pool.query(
      `INSERT INTO saved_articles (user_id, article_slug)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [userId, article.slug]
    );

    const result = await pool.query(
      `SELECT a.* 
       FROM saved_articles s
       JOIN articles a ON s.article_slug = a.slug
       WHERE s.user_id=$1`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// ================= REMOVE ARTICLE =================
router.delete("/remove-article", verifyToken, async (req, res) => {
  try {
    const { slug } = req.body;
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM saved_articles 
       WHERE user_id=$1 AND article_slug=$2`,
      [userId, slug]
    );

    const result = await pool.query(
      `SELECT a.* 
       FROM saved_articles s
       JOIN articles a ON s.article_slug = a.slug
       WHERE s.user_id=$1`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

export default router;
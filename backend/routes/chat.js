import express from "express";
import { pool } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateAIReply } from "../helpers/aiReply.js";

const router = express.Router();


// ================= MEMORY ANALYZER =================
function updateMemoryFromMessage(memory, message) {
  const msg = message.toLowerCase();

  if (msg.includes("რატომ") || msg.includes("როგორ") || msg.includes("?")) {
    memory.curiosity = (memory.curiosity || 0) + 1;
  }

  if (msg.includes("მინდა") || msg.includes("მიზანი") || msg.includes("ვგეგმავ")) {
    memory.ambition = (memory.ambition || 0) + 1;
  }

  if (
    msg.includes("ვგრძნობ") ||
    msg.includes("მგონია") ||
    msg.includes("დაღლილი") ||
    msg.includes("სტრესი")
  ) {
    memory.emotional_depth = (memory.emotional_depth || 0) + 1;
  }

  return memory;
}


// ================= POST CHAT =================
router.post("/", verifyToken, async (req, res) => {
  try {
    let { message, type } = req.body;

    const userId = req.user.id;

    // ================= USER =================
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ reply: "მომხმარებელი ვერ მოიძებნა 😔" });
    }

    // 🔥 FIXED MBTI OVERRIDE (CRITICAL BUG FIX)
    const mbtiType =
      type && type !== "Unknown"
        ? type
        : user.mbti_type || "Unknown";


    // ================= CHAT =================
    let chatResult = await pool.query(
      `SELECT id FROM chats 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    let chatId;

    if (chatResult.rows.length > 0) {
      chatId = chatResult.rows[0].id;
    } else {
      const newChat = await pool.query(
        `INSERT INTO chats (user_id, mbti_type)
         VALUES ($1, $2)
         RETURNING id`,
        [userId, mbtiType]
      );

      chatId = newChat.rows[0].id;
    }


    // ================= MEMORY =================
    let memoryResult = await pool.query(
      "SELECT * FROM memory WHERE user_id=$1",
      [userId]
    );

    let memory;

    if (memoryResult.rows.length === 0) {
      const newMemory = await pool.query(
        `INSERT INTO memory (user_id)
         VALUES ($1)
         RETURNING *`,
        [userId]
      );

      memory = newMemory.rows[0];
    } else {
      memory = memoryResult.rows[0];
    }

    // update memory from message BEFORE AI
    memory = updateMemoryFromMessage(memory, message);


    // ================= SAVE USER MESSAGE =================
    await pool.query(
      `INSERT INTO messages (chat_id, role, text)
       VALUES ($1, $2, $3)`,
      [chatId, "user", message]
    );


    // ================= CONTEXT =================
    const contextResult = await pool.query(
      `SELECT role, text 
       FROM messages 
       WHERE chat_id=$1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [chatId]
    );

    const contextMessages = contextResult.rows.reverse();


    // ================= AI =================
    let reply;

    try {
      reply = await generateAIReply(
        contextMessages,
        message,
        mbtiType,
        memory
      );
    } catch (err) {
      console.error("AI error:", err);
      reply = "AI დროებით მიუწვდომელია 😔";
    }


    // ================= SAVE AI MESSAGE =================
    await pool.query(
      `INSERT INTO messages (chat_id, role, text)
       VALUES ($1, $2, $3)`,
      [chatId, "ai", reply]
    );


    // ================= UPDATE MEMORY =================
    await pool.query(
      `UPDATE memory
       SET 
         conversation_count = conversation_count + 1,
         last_active = NOW(),
         curiosity = $1,
         ambition = $2,
         emotional_depth = $3,
         learning_score = learning_score + 0.01
       WHERE user_id = $4`,
      [
        Number(memory.curiosity || 0),
        Number(memory.ambition || 0),
        Number(memory.emotional_depth || 0),
        userId
      ]
    );


    // ================= RESPONSE =================
    res.json({ reply, mbtiType, userId });

  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ reply: "ჩატი დროებით მიუწვდომელია 😔" });
  }
});


// ================= HISTORY =================
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT m.role, m.text, m.created_at, c.mbti_type
       FROM messages m
       JOIN chats c ON m.chat_id = c.id
       WHERE c.user_id = $1
       ORDER BY m.created_at ASC`,
      [userId]
    );

    res.json({ history: result.rows });

  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ history: [] });
  }
});

export default router;
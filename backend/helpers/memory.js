// helpers/memory.js
import fs from "fs/promises";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "userMemory.json");

/**
 * Load all users memory
 */
export async function loadMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {}; // if file does not exist, return empty
  }
}

/**
 * Save memory
 */
export async function saveMemory(memory) {
  try {
    await fs.writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving memory:", err);
  }
}

/**
 * Get memory for a specific user
 */
export async function getUserMemory(userId) {
  const memory = await loadMemory();
  if (!memory[userId]) {
    memory[userId] = {
      lastTone: "neutral",
      lastGoal: "",
      lastInterest: "",
      conversationCount: 0
    };
  }
  return memory[userId];
}

/**
 * Update user memory
 */
export async function updateUserMemory(userId, updates = {}) {
  const memory = await loadMemory();
  memory[userId] = memory[userId] || {
    lastTone: "neutral",
    lastGoal: "",
    lastInterest: "",
    conversationCount: 0
  };

  memory[userId] = { ...memory[userId], ...updates };
  memory[userId].conversationCount += 1;

  await saveMemory(memory);
  return memory[userId];
}
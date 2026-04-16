// helpers/aiReply.js

import fetch from "node-fetch";

import { getMBTIAdvice } from "./mbtiAdvice.js";
import { buildMBTIPrompt } from "./mbtiResponse.js";

import { addHumor } from "./humorEngine.js";
import { improveGeorgian } from "./georgianLanguageEngine.js";

import { detectMood, emotionalPrefix } from "./emotionalEngine.js";

import { updateGoalMemory, buildGoalReminder } from "./goalMemory.js";
import { updateLearning, buildLearningContext } from "./selfLearning.js";

import {
  updateLastInteraction,
  shouldTriggerProactive,
  buildProactiveMessage
} from "./proactiveEngine.js";


// ================= LANGUAGE =================
function detectLanguage(text) {
  return /[ა-ჰ]/.test(text) ? "ka" : "en";
}


// ================= PERSONALITY =================
function getPersonalityLayer(mbti) {
  const styles = {
    INTJ: "Strategic, analytical, future-focused. Speak concisely.",
    INTP: "Deep thinker, analytical, curious.",
    ENTJ: "Direct, leadership oriented.",
    ENTP: "Creative and playful debater.",

    INFJ: "Deep empathetic mentor.",
    INFP: "Gentle and value-driven.",
    ENFJ: "Motivational leader.",
    ENFP: "Energetic and creative.",

    ISTJ: "Structured and practical.",
    ISFJ: "Caring and stable.",
    ESTJ: "Efficient and directive.",
    ESFJ: "Warm and social.",

    ISTP: "Practical problem solver.",
    ISFP: "Artistic and emotional.",
    ESTP: "Action oriented.",
    ESFP: "Friendly and expressive.",

    DEFAULT: "Balanced mentor."
  };

  return styles[mbti] || styles.DEFAULT;
}


// ================= MEMORY =================
function buildMemoryContext(memory = {}) {
  return `
Goals: ${(memory.goals || []).slice(-5).join(", ") || "None"}
Interests: ${(memory.interests || []).slice(-5).join(", ") || "None"}

Curiosity: ${memory.curiosity || 0}
Ambition: ${memory.ambition || 0}
Emotion: ${memory.emotional_depth || 0}

Use only if relevant.
`;
}


// ================= LENGTH =================
function determineResponseLength(message) {
  return message.trim().split(/\s+/).length > 20 ? "medium" : "short";
}


// ================= MAIN =================
export async function generateAIReply(history, message, mbtiType, memory = {}) {

  // update interaction
  updateLastInteraction(memory);

  // memory systems
  updateGoalMemory(memory, message);
  updateLearning(memory, message);

  const language = detectLanguage(message);
  const mbtiData = getMBTIAdvice(mbtiType);

  if (!mbtiData?.exists) {
    return "შენ ჯერ არ გაქვს MBTI პროფილი.";
  }

  const improvedMessage = await improveGeorgian(message);
  const responseLength = determineResponseLength(improvedMessage);

  // growth
  memory.growthHistory = memory.growthHistory || [];
  memory.thinkingLevel = (memory.thinkingLevel || 0) + 0.05;

  memory.growthHistory.push(improvedMessage);
  memory.growthHistory = memory.growthHistory.slice(-20);

  const mbtiStyle = buildMBTIPrompt(mbtiType);
  const personalityLayer = getPersonalityLayer(mbtiType);

  const memoryContext = buildMemoryContext(memory);
  const goalReminder = buildGoalReminder(memory);
  const learningContext = buildLearningContext(memory);

  // 🔥 PROACTIVE FIX
  let proactiveMode = "";

  if (shouldTriggerProactive(memory)) {
    const question = buildProactiveMessage(mbtiType, memory);

    proactiveMode = `
IMPORTANT:
End your response with this question:
"${question}"
`;
  }

  const mbtiContext = `
MBTI: ${mbtiType}
Tone: ${mbtiData.tone}
Advice: ${mbtiData.advice}
`;

  const languageInstruction =
    language === "ka"
      ? `Respond in natural Georgian. Keep it ${responseLength}.`
      : `Respond in English only.`;

  const recentHistory = history
    .slice(-4)
    .map(m => `${m.role}: ${m.text}`)
    .join("\n");

  const finalPrompt = `
You are an AI mentor with memory + personality.

${languageInstruction}

Personality:
${personalityLayer}

${proactiveMode}

Growth level: ${memory.thinkingLevel}

Recent:
${memory.growthHistory.slice(-5).join(", ")}

${mbtiContext}

${mbtiStyle}

${memoryContext}

${goalReminder}

${learningContext}

Conversation:
${recentHistory}

User:
${improvedMessage}
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: finalPrompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 700
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return "AI error 😔";
    }

    let reply = data?.response || "No response";

    const mood = detectMood(message);
    const prefix = emotionalPrefix(mood);

    if (prefix) reply = `${prefix} ${reply}`;

    reply = addHumor(reply, {
      mode: "friendly",
      emotionalState: memory.emotional_depth > 5 ? "supportive" : "neutral"
    });

    return reply.replace(/\s+/g, " ").trim();

  } catch (err) {
    return "AI error 😔";
  }
}
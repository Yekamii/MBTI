// models/Chat.js

// 🔹 Simple in-memory chat storage (MongoDB-ს გარეშე)
const chats = [];

export default {
  chats,

  createChat(userId, mbtiType = "Unknown") {
    const newChat = {
      id: Date.now().toString(),
      userId,
      mbtiType,
      messages: [],
      memory: {
        goals: [],
        interests: [],
        lastTone: "neutral",
        conversationCount: 0,
        lastActive: new Date(),
        // 🔥 AI GROWTH
        growthHistory: [],
        thinkingLevel: 0,
        // 🔥 LEARNING
        curiosity: [],
        // 🔥 PROFILE
        profile: { curiosity: 0, ambition: 0, emotionalDepth: 0 }
      },
      style: {}
    };
    chats.push(newChat);
    return newChat;
  },

  getChatByUserId(userId) {
    return chats.find(chat => chat.userId === userId);
  },

  addMessage(userId, role, text) {
    const chat = chats.find(c => c.userId === userId);
    if (!chat) return null;
    chat.messages.push({ role, text, date: new Date() });
    chat.memory.lastActive = new Date();
    chat.memory.conversationCount += 1;
    return chat;
  },

  updateMemory(userId, newMemory) {
    const chat = chats.find(c => c.userId === userId);
    if (!chat) return null;
    chat.memory = { ...chat.memory, ...newMemory };
    return chat;
  }
};
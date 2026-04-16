// models/User.js
import { randomUUID } from "crypto";

const users = []; // დროებითი in-memory "ბაზა"

const User = {

  // Google login-ით მოძებნა
  async findOne({ googleId }) {
    return users.find(u => u.googleId === googleId) || null;
  },

  // 🔥 საჭიროა profile / chat / mbti save-სთვის
  async findById(id) {
    return users.find(u => u._id === id) || null;
  },

  // ახალი user შექმნა
  async create(data) {
    const newUser = {
      _id: randomUUID(),   // 🔥 აუცილებელია JWT + auth
      savedArticles: [],
      savedResults: [],
      mbtiType: "Unknown",
      ...data
    };

    users.push(newUser);
    return newUser;
  },

  // update
  async save(user) {
    return user;
  }

};

export default User;
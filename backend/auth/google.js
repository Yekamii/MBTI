// auth/google.js
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || "";
        const name = profile.displayName || "";
        const photo = profile.photos?.[0]?.value || "";

        const userResult = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [googleId]
        );

        let user;

        if (userResult.rows.length === 0) {
          const newUser = await pool.query(
            `INSERT INTO users (google_id, email, name, photo, mbti_type)
             VALUES ($1,$2,$3,$4,'Unknown')
             RETURNING *`,
            [googleId, email, name, photo]
          );

          user = newUser.rows[0];
        } else {
          user = userResult.rows[0];
        }

        // 🔥 FIX: normalize field names for frontend + jwt
        return done(null, {
          id: user.id,
          google_id: user.google_id,
          email: user.email,
          name: user.name,
          photo: user.photo,
          mbti_type: user.mbti_type,
        });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
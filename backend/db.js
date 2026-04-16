// db.jd
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: process.env.DB_PASSWORD,
  database: "mbti_ai",
  port: 5432,
});
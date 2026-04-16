import { pool } from "./db.js";

const test = async () => {
  const res = await pool.query("SELECT NOW()");
  console.log("DB Connected:", res.rows[0]);
};

test();
import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const login = async ({ email, password }) => {
  const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
  const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  const result = await pool.query(query);

  if (!result.rows.length) {
    throw new Error("User tidak ditemukan");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Password salah");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_TOKEN_KEY,
    {
      expiresIn: "3h",
    },
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_KEY,
    { expiresIn: "7d" },
  );

  await pool.query({
    text: `
      INSERT INTO authentications (token)
      VALUES($1)
    `,
    values: [refreshToken],
  });

  return {
    accessToken,
    refreshToken,
  };
};

export default { login };

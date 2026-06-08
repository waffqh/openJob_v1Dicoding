import pool from "../config/database.js";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import cache from "../utils/cache.js";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);
const addUser = async ({ name, email, password, role = "user" }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const id = `user-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO users(
        id,
        name,
        email,
        password,
        role
      )
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, name, email
    `,
    values: [id, name, email, hashedPassword, role],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getUserById = async (res, id) => {
  const cacheKey = `user:${id}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    res.set("X-Data-Source", "cache");
    return res.status(200).json({
      status: "success",
      data: cached,
    });
  }

  const users = await pool.query({
    text: `
      SELECT id, name, email
      FROM users
      WHERE id = $1
    `,
    values: [id],
  });

  if (!users.rows.length) {
    const error = new Error("User tidak ditemukan");
    error.name = "NotFoundError";
    throw error;
  }

  res.set("X-Data-Source", "database");

  await cache.set(cacheKey, users);

  return users.rows[0];
};

export default {
  addUser,
  getUserById,
};

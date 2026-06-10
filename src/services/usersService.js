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

  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (existing.rows.length) {
    throw new Error("Email sudah terdaftar");
  }

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

const getUserById = async (id) => {
  const result = await pool.query({
    text: `
      SELECT id, name, email
      FROM users
      WHERE id = $1
    `,
    values: [id],
  });

  if (!result.rows.length) {
    const error = new Error("User tidak ditemukan");
    error.name = "NotFoundError";
    throw error;
  }

  return result.rows[0];
};

const updateUser = async (id, data) => {
  const existing = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  if (!existing.rows.length) {
    const error = new Error("User tidak ditemukan");
    error.name = "NotFoundError";
    throw error;
  }

  const oldData = existing.rows[0];

  // If password is being updated, hash it
  let updates = {
    name: data.name ?? oldData.name,
    email: data.email ?? oldData.email,
  };

  if (data.password) {
    updates.password = await bcrypt.hash(data.password, 10);
  } else {
    updates.password = oldData.password;
  }

  const result = await pool.query(
    `UPDATE users SET
      name = $1,
      email = $2,
      password = $3
     WHERE id = $4
     RETURNING id, name, email`,
    [updates.name, updates.email, updates.password, id],
  );

  return result.rows[0];
};

export default {
  addUser,
  getUserById,
  updateUser,
};

import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const addUser = async ({
  name,
  email,
  password,
  role = 'user',
}) => {
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

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
    values: [
      id,
      name,
      email,
      hashedPassword,
      role,
    ],
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

  // Jika user tidak ditemukan, lempar NotFoundError agar ditangkap 404 oleh controller
  if (!result.rows.length) {
    const error = new Error('User tidak ditemukan');
    error.name = 'NotFoundError';
    throw error;
  }

  return result.rows[0];
};

export default {
  addUser,
  getUserById,
};
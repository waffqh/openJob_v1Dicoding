import pool from "../config/database.js";
import { nanoid } from "nanoid";

const addCategory = async ({ name }) => {
  const id = `category-${nanoid(16)}`;

  const result = await pool.query({
    text: `
      INSERT INTO categories(id, name)
      VALUES($1, $2)
      RETURNING id, name
    `,
    values: [id, name],
  });

  return result.rows[0];
};

const getCategories = async () => {
  const result = await pool.query(`
    SELECT *
    FROM categories
  `);

  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query({
    text: `
      SELECT *
      FROM categories
      WHERE id = $1
    `,
    values: [id],
  });

  if (!result.rows.length) {
    throw new Error("Category tidak ditemukan");
  }

  return result.rows[0];
};

const updateCategoryById = async (
  id,
  { name }
) => {
  const result = await pool.query({
    text: `
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING id
    `,
    values: [name, id],
  });

  if (!result.rows.length) {
    throw new Error("Category tidak ditemukan");
  }
};

const deleteCategoryById = async (id) => {
  const result = await pool.query({
    text: `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
    `,
    values: [id],
  });

  if (!result.rows.length) {
    throw new Error("Category tidak ditemukan");
  }
};

export default {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};

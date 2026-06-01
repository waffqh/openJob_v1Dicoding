import pool from "../config/database.js";
import { nanoid } from "nanoid";

const addCompany = async ({
  name,
  location,
  description,
}) => {
  const id = `company-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO companies(
        id,
        name,
        location,
        description
      )
      VALUES($1, $2, $3, $4)
      RETURNING id
    `,
    values: [
      id,
      name,
      location,
      description,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getCompanies = async () => {
  const result = await pool.query(`
    SELECT *
    FROM companies
  `);

  return result.rows;
};

const getCompanyById = async (id) => {
  const result = await pool.query({
    text: `
      SELECT *
      FROM companies
      WHERE id = $1
    `,
    values: [id],
  });

  if (!result.rows.length) {
    throw new Error("Company tidak ditemukan");
  }

  return result.rows[0];
};

const updateCompanyById = async (
  id,
  {
    name,
    location,
    description,
  }
) => {
  const result = await pool.query({
    text: `
      UPDATE companies
      SET
        name = $1,
        location = $2,
        description = $3
      WHERE id = $4
      RETURNING id
    `,
    values: [
      name,
      location,
      description,
      id,
    ],
  });

  if (!result.rows.length) {
    throw new Error("Company tidak ditemukan");
  }
};

const deleteCompanyById = async (id) => {
  const result = await pool.query({
    text: `
      DELETE FROM companies
      WHERE id = $1
      RETURNING id
    `,
    values: [id],
  });

  if (!result.rows.length) {
    throw new Error("Company tidak ditemukan");
  }
};

export default {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
};

import pool from "../config/database.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);

const addJob = async ({
  company_id,
  category_id,
  title,
  description,
  location_city,
  job_type,
  experience_level,
  location_type,
  salary_min,
  salary_max,
  is_salary_visible,
  status = "open",
}) => {
  const id = `job-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO jobs(
        id,
        company_id,
        category_id,
        title,
        description,
        salary_min,
        salary_max,
        is_salary_visible,
        job_type,
        experience_level,
        location_type,
        location_city,
        status
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `,
    values: [
      id,
      company_id,
      category_id,
      title,
      description,
      salary_min,
      salary_max,
      is_salary_visible,
      job_type,
      experience_level,
      location_type,
      location_city,
      status,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getJobs = async () => {
  const result = await pool.query("SELECT * FROM jobs");

  return result.rows;
};

const getJobById = async (id) => {
  const result = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
  if (!result.rows.length) {
    throw new Error("Category tidak ditemukan");
  }
  return result.rows[0];
};

const getJobByCompanyId = async (id) => {
  const result = await pool.query(`SELECT * FROM jobs WHERE company_id = $1`, [
    id,
  ]);
  // if (!result.rows.length) {
  //   throw new Error("Category tidak ditemukan");
  // }
  return result.rows;
};

const getJobByCategoryId = async (id) => {
  const result = await pool.query(`SELECT * FROM jobs WHERE category_id = $1`, [
    id,
  ]);
  // if (!result.rows.length) {
  //   throw new Error("Category tidak ditemukan");
  // }
  return result.rows;
};

const updateJob = async (id, data) => {
  const existing = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
  if (!existing.rows.length) {
    throw new Error("Job tidak ditemukan");
  }

  const oldData = existing.rows[0];

  const result = await pool.query(
    `UPDATE jobs SET 
        title             = $1,
        description       = $2,
        company_id        = $3,
        category_id       = $4,
        job_type          = $5,
        experience_level  = $6,
        location_type     = $7,
        location_city     = $8,
        salary_min        = $9,
        salary_max        = $10,
        is_salary_visible = $11,
        status            = $12
      WHERE id = $13
      RETURNING *`,
    [
      data.title !== undefined ? data.title : oldData.title,
      data.description !== undefined ? data.description : oldData.description,
      data.company_id !== undefined ? data.company_id : oldData.company_id,
      data.category_id !== undefined ? data.category_id : oldData.category_id,
      data.job_type !== undefined ? data.job_type : oldData.job_type,
      data.experience_level !== undefined
        ? data.experience_level
        : oldData.experience_level,
      data.location_type !== undefined
        ? data.location_type
        : oldData.location_type,
      data.location_city !== undefined
        ? data.location_city
        : oldData.location_city,
      data.salary_min !== undefined ? data.salary_min : oldData.salary_min,
      data.salary_max !== undefined ? data.salary_max : oldData.salary_max,
      data.is_salary_visible !== undefined
        ? data.is_salary_visible
        : oldData.is_salary_visible,
      data.status !== undefined ? data.status : oldData.status,
      id,
    ],
  );

  return result.rows[0]; // Kembalikan satu objek row, bukan array kosong
};

const deleteJob = async (id) => {
  const existing = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
  if (!existing.rows.length) {
    throw new Error("Job tidak ditemukan");
  }
  await pool.query("DELETE FROM jobs WHERE id = $1", [id]);
};

export default {
  addJob,
  getJobs,
  getJobById,
  getJobByCompanyId,
  getJobByCategoryId,
  updateJob,
  deleteJob,
};

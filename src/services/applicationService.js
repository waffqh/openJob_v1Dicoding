import pool from "../config/database.js";
import { nanoid } from "nanoid";
import { formatApplication } from "../utils/undex.js";

const APPLICATION_SELECT = `
  a.id,
  a.status,
  a.created_at,
  a.updated_at,
  u.id    AS user_id,
  u.name  AS user_name,
  u.email AS user_email,
  j.id    AS job_id,
  j.title AS job_title,
  j.location_city    AS job_location,
  j.description      AS job_description,
  c.id    AS company_id,
  c.name  AS company_name,
  c.location  AS company_location,
  d.id        AS document_id,
  d.file_name AS document_file_name,
  d.file_url  AS document_file_url
`;

const APPLICATION_JOIN = `
  FROM applications a
  JOIN users     u ON a.user_id     = u.id
  JOIN jobs      j ON a.job_id      = j.id
  JOIN companies c ON j.company_id  = c.id
  LEFT JOIN documents d ON a.document_id = d.id
`;

const addApplication = async ({ user_id, job_id, status }) => {
  const id = `application-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO applications(
        id,
        user_id,
        job_id,
        status
      )
      VALUES($1, $2, $3, $4)
      RETURNING id
    `,
    values: [id, user_id, job_id, status],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getApplications = async () => {
  const result = await pool.query(
    `SELECT ${APPLICATION_SELECT} ${APPLICATION_JOIN} ORDER BY a.created_at DESC`,
  );
  return result.rows.map(formatApplication);
};

const getApplicationsById = async (res, id) => {
  const result = await pool.query("SELECT * FROM applications WHERE id =$1", [
    id,
  ]);

  return result.rows[0];
};

const getApplicationsByUserId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM applications WHERE user_id =$1",
    [id],
  );

  return result.rows.map(formatApplication);
};

const getApplicationsByJobId = async (id) => {
  const result = await pool.query(
    "SELECT * FROM applications WHERE job_id =$1",
    [id],
  );

  return result.rows;
};

const updateApplicationsById = async (id, data) => {
  const existing = await pool.query(
    `SELECT * FROM applications WHERE id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Applications tidak ditemukan");
  }

  const oldData = existing.rows[0];

  const result = await pool.query(
    `UPDATE applications SET
      user_id = $1,
      job_id = $2,
      status = $3
     WHERE id = $4
     RETURNING *`,
    [
      data.user_id ?? oldData.user_id,
      data.job_id ?? oldData.job_id,
      data.status ?? oldData.status,
      id,
    ],
  );

  return result.rows;
};

const deleteApplicationsById = async (id) => {
  const existing = await pool.query(
    `SELECT * FROM applications WHERE id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Applications tidak ditemukan");
  }
  await pool.query("DELETE FROM applications WHERE id = $1", [id]);
};

export default {
  addApplication,
  getApplications,
  getApplicationsById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplicationsById,
  deleteApplicationsById,
};

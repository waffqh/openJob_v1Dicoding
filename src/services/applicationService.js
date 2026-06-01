import pool from '../config/database.js';
import { nanoid } from 'nanoid';

const addApplication = async ({
  user_id,
  job_id,
  status,
}) => {
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
    values: [
      id,
      user_id,
      job_id,
      status,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getApplications = async () => {
  const result = await pool.query(
    'SELECT * FROM applications'
  );

  return result.rows;
};

export default {
  addApplication,
  getApplications,
};
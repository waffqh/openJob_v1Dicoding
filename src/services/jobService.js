import pool from '../config/database.js';
import { nanoid } from 'nanoid';

const addJob = async ({
  title,
  description,
  company_id,
  category_id,
}) => {
  const id = `job-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO jobs(
        id,
        title,
        description,
        company_id,
        category_id
      )
      VALUES($1, $2, $3, $4, $5)
      RETURNING id
    `,
    values: [
      id,
      title,
      description,
      company_id,
      category_id,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getJobs = async () => {
  const result = await pool.query(
    'SELECT * FROM jobs'
  );

  return result.rows;
};

export default {
  addJob,
  getJobs,
};
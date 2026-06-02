import pool from "../config/database.js";
import { nanoid } from "nanoid";

const addJob = async ({
  company_id,
  category_id,
  title,
  description,
  location,
  job_type,
  experience_level,
  location_type,
  status = 'open',
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
   
        job_type,
        experience_level,
        location_type,
        status
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
    `,
    values: [
      id,
      company_id,
      category_id,
      title,
      description,

      job_type,
      experience_level,
      location_type,
      status,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getJobs = async () => {
  const result = await pool.query(
    "SELECT * FROM jobs"
  );

  return result.rows;
};

export default {
  addJob,
  getJobs,
};
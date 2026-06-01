import pool from '../config/database.js';
import { nanoid } from 'nanoid';

const addBookmark = async ({
  user_id,
  job_id,
}) => {
  const id = `bookmark-${nanoid(16)}`;

  const query = {
    text: `
      INSERT INTO bookmarks(
        id,
        user_id,
        job_id
      )
      VALUES($1, $2, $3)
      RETURNING id
    `,
    values: [
      id,
      user_id,
      job_id,
    ],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getBookmarks = async () => {
  const result = await pool.query(
    'SELECT * FROM bookmarks'
  );

  return result.rows;
};

export default {
  addBookmark,
  getBookmarks,
};
import pool from "../config/database.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);

const BOOKMARK_SELECT = `
  b.id,
  b.created_at,
  u.id    AS user_id,
  u.name  AS user_name,
  j.id    AS job_id,
  j.title AS job_title,
  j.description AS job_description,
  j.job_type,
  j.salary_min,
  j.salary_max,
  j.location_type,
  j.location_city,
  j.status AS job_status,
  c.id    AS company_id,
  c.name  AS company_name,
  c.location AS company_location,
  cat.id   AS category_id,
  cat.name AS category_name
`;

const BOOKMARK_JOIN = `
  FROM bookmarks b
  JOIN users      u   ON b.user_id     = u.id
  JOIN jobs       j   ON b.job_id      = j.id
  JOIN companies  c   ON j.company_id  = c.id
  JOIN categories cat ON j.category_id = cat.id
`;

const addBookmark = async (req) => {
  const jobId = req.params.id;
  const userId = req.user.id;

  const job = await pool.query("SELECT id FROM jobs WHERE id = $1", [jobId]);

  if (!job.rows.length) {
    throw new Error("job tidak ditemukan");
  }

  const existing = await pool.query(
    "SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2",
    [userId, jobId],
  );

  if (existing.rows.length) {
    throw new Error("Bookmark sudah ada");
  }

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
    values: [id, userId, jobId],
  };

  const result = await pool.query(query);

  return result.rows[0];
};

const getBookmarks = async (id) => {
  const result = await pool.query(
    `SELECT ${BOOKMARK_SELECT} ${BOOKMARK_JOIN}
         WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
    [id],
  );
  return result.rows;
};

const deleteBookmark = async (id) => {
  const existing = await pool.query(
    `SELECT * FROM bookmarks WHERE job_id = $1`,
    [id],
  );
  if (!existing.rows.length) {
    throw new Error("Bookmark tidak ditemukan");
  }
  await pool.query("DELETE FROM bookmarks WHERE job_id = $1", [id]);
};

const getBookmarkById = async (id, jobId) => {
  const result = await pool.query(
    `SELECT ${BOOKMARK_SELECT} ${BOOKMARK_JOIN}
         WHERE b.id = $1 AND b.job_id = $2`,
    [id, jobId],
  );
  if (!result.rows.length) {
    throw new Error("Bookmark tidak ditemukan");
  }
  return result.rows[0];
};

export default {
  addBookmark,
  getBookmarks,
  deleteBookmark,
  getBookmarkById,
};

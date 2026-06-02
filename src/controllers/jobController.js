import jobService from '../services/jobService.js';

export const addJobHandler = async (req, res) => {
  try {
    const result = await jobService.addJob(req.body);

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
};

export const getJobsHandler = async (req, res) => {
  try {
    const result = await jobService.getJobs();

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const getJobByIdHandler = async (req, res) => {
  try {
    const result = await jobService.getJobById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ status: 'failed', message: error.message });
    }
    return res.status(500).json({ status: 'failed', message: error.message });
  }
};

const getJobById = async (id) => {
  const query = {
    text: 'SELECT * FROM jobs WHERE id = $1',
    values: [id],
  };

  const result = await pool.query(query);

  if (!result.rows.length) {
    throw new Error('Job tidak ditemukan');
  }

  return result.rows[0];
};
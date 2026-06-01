import applicationService from '../services/applicationService.js';

export const applyJobHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await applicationService.applyJob({
      userId,
      jobId: req.body.jobId,
    });

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
};

export const getApplicationsHandler = async (req, res) => {
  try {
    const result = await applicationService.getApplications();

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
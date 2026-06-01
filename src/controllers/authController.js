import authService from '../services/authService.js';

export const loginHandler = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    if (error.name === 'InvariantError') {
      return res.status(400).json({ status: 'failed', message: error.message });
    }
    if (error.name === 'AuthenticationError') {
      return res.status(401).json({ status: 'failed', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'server error' });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.body);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(401).json({ status: 'failed', message: error.message });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    await authService.logout(req.body);

    return res.status(200).json({
      status: 'success',
      message: 'logout success',
    });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
};
import userService from '../services/userService.js';

export const addUserHandler = async (req, res) => {
  try {
    const result = await userService.addUser(req.body);

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ status: 'failed', message: error.message });
    }

    return res.status(400).json({ status: 'failed', message: error.message });
  }
};
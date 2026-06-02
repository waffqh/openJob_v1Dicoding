import userService from '../services/userService.js';
import { userSchema } from '../validators/userValidator.js';

export const addUserHandler = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }

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
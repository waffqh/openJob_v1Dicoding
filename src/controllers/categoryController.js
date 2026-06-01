import categoryService from '../services/categoryService.js';

export const addCategoryHandler = async (req, res) => {
  try {
    const result = await categoryService.addCategory(req.body);

    return res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ status: 'failed', message: error.message });
  }
};

export const getCategoriesHandler = async (req, res) => {
  try {
    const result = await categoryService.getCategories();

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ status: 'failed', message: error.message });
  }
};
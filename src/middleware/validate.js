const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'failed',
        message: error.details[0].message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: error.message,
    });
  }
};

export default validate;
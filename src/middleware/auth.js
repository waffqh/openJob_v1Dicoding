import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      'accesssecret'
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'failed',
      message: 'Invalid token',
    });
  }
};

export default auth;
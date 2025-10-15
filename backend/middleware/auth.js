const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const isFreelancer = (req, res, next) => {
  if (req.user.userType !== 'freelancer') {
    return res.status(403).json({ message: 'Access denied. Freelancers only.' });
  }
  next();
};

const isClient = (req, res, next) => {
  if (req.user.userType !== 'client') {
    return res.status(403).json({ message: 'Access denied. Clients only.' });
  }
  next();
};

module.exports = { authenticate, isFreelancer, isClient };

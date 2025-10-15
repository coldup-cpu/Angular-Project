const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getGigs,
  sendRequest,
  getOrders,
  getProfile,
  updateProfile
} = require('../controllers/freelancerController');
const { authenticate, isFreelancer } = require('../middleware/auth');

router.use(authenticate, isFreelancer);

router.get('/dashboard', getDashboard);
router.get('/gigs', getGigs);
router.post('/request', sendRequest);
router.get('/orders', getOrders);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;

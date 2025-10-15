const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getGigs,
  createGig,
  getRequests,
  acceptRequest,
  getProjects,
  getProfile,
  updateProfile
} = require('../controllers/clientController');
const { authenticate, isClient } = require('../middleware/auth');

router.use(authenticate, isClient);

router.get('/dashboard', getDashboard);
router.get('/gigs', getGigs);
router.post('/gigs', createGig);
router.get('/requests', getRequests);
router.patch('/requests/:id/accept', acceptRequest);
router.get('/projects', getProjects);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;

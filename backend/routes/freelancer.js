const express = require('express');
const Gig = require('../models/Gig');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/freelancer/gigs
// @desc    Get available gigs for freelancers
// @access  Private (Freelancer only)
router.get('/gigs', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'open' })
      .populate('client', 'firstName lastName profile.avatar profile.rating')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/freelancer/gigs/:id/apply
// @desc    Apply to a gig
// @access  Private (Freelancer only)
router.post('/gigs/:id/apply', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const { proposal, bidAmount } = req.body;
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if already applied
    const alreadyApplied = gig.applicants.some(
      applicant => applicant.freelancer.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this gig' });
    }

    // Add application
    gig.applicants.push({
      freelancer: req.user._id,
      proposal,
      bidAmount,
      appliedAt: new Date()
    });

    await gig.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply to gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/freelancer/orders
// @desc    Get freelancer's orders/projects
// @access  Private (Freelancer only)
router.get('/orders', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user._id })
      .populate('client', 'firstName lastName profile.avatar')
      .populate('gig', 'title category')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/freelancer/dashboard
// @desc    Get freelancer dashboard data
// @access  Private (Freelancer only)
router.get('/dashboard', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ 
      freelancer: req.user._id, 
      status: 'active' 
    });

    const totalEarnings = await Project.aggregate([
      { $match: { freelancer: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);

    const monthlyEarnings = await Project.aggregate([
      { 
        $match: { 
          freelancer: req.user._id, 
          status: 'completed',
          updatedAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          }
        } 
      },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);

    const recentProjects = await Project.find({ freelancer: req.user._id })
      .populate('client', 'firstName lastName profile.avatar')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      activeProjects,
      totalEarnings: totalEarnings[0]?.total || 0,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      recentProjects
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/freelancer/profile
// @desc    Get freelancer profile
// @access  Private (Freelancer only)
router.get('/profile', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/freelancer/profile
// @desc    Update freelancer profile
// @access  Private (Freelancer only)
router.put('/profile', auth, requireRole('freelancer'), async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
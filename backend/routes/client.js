const express = require('express');
const Gig = require('../models/Gig');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/client/gigs
// @desc    Create a new gig
// @access  Private (Client only)
router.post('/gigs', auth, requireRole('client'), async (req, res) => {
  try {
    const gigData = {
      ...req.body,
      client: req.user._id
    };

    const gig = new Gig(gigData);
    await gig.save();

    const populatedGig = await Gig.findById(gig._id)
      .populate('client', 'firstName lastName profile.avatar');

    res.status(201).json(populatedGig);
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/client/gigs
// @desc    Get client's posted gigs
// @access  Private (Client only)
router.get('/gigs', auth, requireRole('client'), async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user._id })
      .populate('applicants.freelancer', 'firstName lastName profile.avatar profile.rating profile.skills')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get client gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/client/gigs/:gigId/accept/:freelancerId
// @desc    Accept a freelancer's application
// @access  Private (Client only)
router.post('/gigs/:gigId/accept/:freelancerId', auth, requireRole('client'), async (req, res) => {
  try {
    const { gigId, freelancerId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the application
    const application = gig.applicants.find(
      app => app.freelancer.toString() === freelancerId
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create project
    const project = new Project({
      gig: gigId,
      client: req.user._id,
      freelancer: freelancerId,
      title: gig.title,
      description: gig.description,
      budget: application.bidAmount,
      deadline: gig.deadline,
      status: 'active'
    });

    await project.save();

    // Update gig status
    gig.status = 'in_progress';
    await gig.save();

    const populatedProject = await Project.findById(project._id)
      .populate('client', 'firstName lastName profile.avatar')
      .populate('freelancer', 'firstName lastName profile.avatar');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Accept application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/client/projects
// @desc    Get client's projects
// @access  Private (Client only)
router.get('/projects', auth, requireRole('client'), async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('freelancer', 'firstName lastName profile.avatar profile.rating')
      .populate('gig', 'title category')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/client/dashboard
// @desc    Get client dashboard data
// @access  Private (Client only)
router.get('/dashboard', auth, requireRole('client'), async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ 
      client: req.user._id, 
      status: 'active' 
    });

    const totalSpent = await Project.aggregate([
      { $match: { client: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);

    const postedGigs = await Gig.countDocuments({ client: req.user._id });

    const recentProjects = await Project.find({ client: req.user._id })
      .populate('freelancer', 'firstName lastName profile.avatar')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      activeProjects,
      totalSpent: totalSpent[0]?.total || 0,
      postedGigs,
      recentProjects
    });
  } catch (error) {
    console.error('Get client dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/client/profile
// @desc    Get client profile
// @access  Private (Client only)
router.get('/profile', auth, requireRole('client'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/client/profile
// @desc    Update client profile
// @access  Private (Client only)
router.put('/profile', auth, requireRole('client'), async (req, res) => {
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
const FreelancerProfile = require('../models/FreelancerProfile');
const Gig = require('../models/Gig');
const Request = require('../models/Request');
const Project = require('../models/Project');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const pendingRequestsCount = await Request.countDocuments({
      freelancerId,
      status: 'pending'
    });

    const activeProjectsCount = await Project.countDocuments({
      freelancerId,
      status: 'active'
    });

    const completedProjectsCount = await Project.countDocuments({
      freelancerId,
      status: 'completed'
    });

    res.status(200).json({
      pendingRequestsCount,
      activeProjectsCount,
      completedProjectsCount
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'firstName lastName email');

    res.status(200).json({ gigs });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendRequest = async (req, res) => {
  try {
    const { gigId, requestMessage } = req.body;
    const freelancerId = req.user._id;

    if (!gigId) {
      return res.status(400).json({ message: 'Gig ID is required' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status === 'closed') {
      return res.status(400).json({ message: 'This gig is closed' });
    }

    const existingRequest = await Request.findOne({ gigId, freelancerId });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already sent a request for this gig' });
    }

    const request = new Request({
      gigId,
      freelancerId,
      requestMessage: requestMessage || ''
    });

    await request.save();

    res.status(201).json({ message: 'Request sent successfully', request });
  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const pendingRequests = await Request.find({
      freelancerId,
      status: 'pending'
    })
      .populate('gigId')
      .populate('gigId.clientId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const activeProjects = await Project.find({
      freelancerId,
      status: 'active'
    })
      .populate('gigId')
      .populate('clientId', 'firstName lastName email')
      .sort({ startedAt: -1 });

    const completedProjects = await Project.find({
      freelancerId,
      status: 'completed'
    })
      .populate('gigId')
      .populate('clientId', 'firstName lastName email')
      .sort({ completedAt: -1 });

    res.status(200).json({
      pending: pendingRequests,
      active: activeProjects,
      completed: completedProjects
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await FreelancerProfile.findOne({ userId }).populate('userId', 'firstName lastName email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, bio, skills, experienceYears, profileImageUrl } = req.body;

    const profile = await FreelancerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (title !== undefined) profile.title = title;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (profileImageUrl !== undefined) profile.profileImageUrl = profileImageUrl;

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getGigs,
  sendRequest,
  getOrders,
  getProfile,
  updateProfile
};

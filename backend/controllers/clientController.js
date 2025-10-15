const ClientProfile = require('../models/ClientProfile');
const Gig = require('../models/Gig');
const Request = require('../models/Request');
const Project = require('../models/Project');
const FreelancerProfile = require('../models/FreelancerProfile');

const getDashboard = async (req, res) => {
  try {
    const clientId = req.user._id;

    const totalGigsPosted = await Gig.countDocuments({ clientId });

    const pendingRequestsCount = await Request.countDocuments({
      status: 'pending'
    }).populate({
      path: 'gigId',
      match: { clientId }
    }).then(requests => requests.filter(r => r.gigId).length);

    const activeProjectsCount = await Project.countDocuments({
      clientId,
      status: 'active'
    });

    res.status(200).json({
      totalGigsPosted,
      pendingRequestsCount,
      activeProjectsCount
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getGigs = async (req, res) => {
  try {
    const clientId = req.user._id;

    const gigs = await Gig.find({ clientId }).sort({ createdAt: -1 });

    res.status(200).json({ gigs });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createGig = async (req, res) => {
  try {
    const { title, description, category, budget, deadline } = req.body;
    const clientId = req.user._id;

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const gig = new Gig({
      clientId,
      title,
      description,
      category,
      budget,
      deadline
    });

    await gig.save();

    const clientProfile = await ClientProfile.findOne({ userId: clientId });
    if (clientProfile) {
      clientProfile.totalGigsPosted += 1;
      await clientProfile.save();
    }

    res.status(201).json({ message: 'Gig created successfully', gig });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const clientId = req.user._id;

    const gigs = await Gig.find({ clientId, status: 'open' }).select('_id');
    const gigIds = gigs.map(gig => gig._id);

    const requests = await Request.find({
      gigId: { $in: gigIds },
      status: 'pending'
    })
      .populate('gigId')
      .populate('freelancerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const freelancerProfile = await FreelancerProfile.findOne({
          userId: request.freelancerId._id
        });
        return {
          ...request.toObject(),
          freelancerProfile
        };
      })
    );

    res.status(200).json({ requests: requestsWithProfiles });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id).populate('gigId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.gigId.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'accepted';
    await request.save();

    const project = new Project({
      gigId: request.gigId._id,
      clientId: request.gigId.clientId,
      freelancerId: request.freelancerId,
      requestId: request._id
    });

    await project.save();

    const gig = await Gig.findById(request.gigId._id);
    gig.status = 'closed';
    await gig.save();

    await Request.updateMany(
      { gigId: request.gigId._id, _id: { $ne: request._id } },
      { status: 'rejected' }
    );

    res.status(200).json({ message: 'Request accepted successfully', project });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const clientId = req.user._id;

    const projects = await Project.find({ clientId })
      .populate('gigId')
      .populate('freelancerId', 'firstName lastName email')
      .sort({ startedAt: -1 });

    const projectsWithProfiles = await Promise.all(
      projects.map(async (project) => {
        const freelancerProfile = await FreelancerProfile.findOne({
          userId: project.freelancerId._id
        });
        return {
          ...project.toObject(),
          freelancerProfile
        };
      })
    );

    res.status(200).json({ projects: projectsWithProfiles });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await ClientProfile.findOne({ userId }).populate('userId', 'firstName lastName email');

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
    const { companyName, bio, profileImageUrl } = req.body;

    const profile = await ClientProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (bio !== undefined) profile.bio = bio;
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
  createGig,
  getRequests,
  acceptRequest,
  getProjects,
  getProfile,
  updateProfile
};

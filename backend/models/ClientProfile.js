const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  totalGigsPosted: {
    type: Number,
    default: 0
  },
  profileImageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClientProfile', clientProfileSchema);

const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  photo: {
    url: { type: String, required: true },
    publicId: { type: String }
  },
  category: {
    type: String,
    enum: ['Roads', 'Water', 'Electricity', 'Garbage', 'Streetlight', 'Other'],
    default: 'Other'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  priority: {
    type: Number,
    default: 0
  },
  upvoteCount: {
    type: Number,
    default: 0
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true })

issueSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Issue', issueSchema)
const Issue = require('../models/Issue.model')

// @route  POST /api/issues
const createIssue = async (req, res) => {
  const { title, description, category, latitude, longitude, address } = req.body

  try {
    const photo = req.file ? {
      url: req.file.path,
      publicId: req.file.filename
    } : {
      url: "https://via.placeholder.com/400x300/2ECC71/ffffff?text=No+Photo",
      publicId: "no-photo"
    };

    const issueData = {
      title: title.trim(),
      description: description || '',
      category: category || 'Other',
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address || 'Coimbatore'
      },
      reportedBy: req.user._id,
      photo: photo
    };

    const issue = await Issue.create(issueData)

    res.status(201).json(issue)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reportedBy', 'name email')
      .sort({ upvoteCount: -1, createdAt: -1 })

    res.status(200).json(issues)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/issues/:id
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    res.status(200).json(issue)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  DELETE /api/issues/:id
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    if (issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this issue' })
    }

    await issue.deleteOne()
    res.status(200).json({ message: 'Issue deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createIssue, getIssues, getIssueById, deleteIssue }

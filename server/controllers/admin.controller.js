const Issue = require('../models/Issue.model')
const User = require('../models/User.model')

// @route  GET /api/admin/issues
const getAllIssues = async (req, res) => {
  try {
    const { status, category, sortBy } = req.query

    let filter = {}
    if (status) filter.status = status
    if (category) filter.category = category

    let sort = { createdAt: -1 }
    if (sortBy === 'priority') sort = { priority: -1 }
    if (sortBy === 'upvotes') sort = { upvoteCount: -1 }
    if (sortBy === 'oldest') sort = { createdAt: 1 }

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort(sort)

    res.status(200).json({
      total: issues.length,
      issues
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments()
    const pending = await Issue.countDocuments({ status: 'Pending' })
    const inProgress = await Issue.countDocuments({ status: 'In Progress' })
    const resolved = await Issue.countDocuments({ status: 'Resolved' })
    const totalUsers = await User.countDocuments({ role: 'citizen' })

    const byCategory = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const topIssues = await Issue.find()
      .sort({ upvoteCount: -1 })
      .limit(5)
      .select('title upvoteCount status category location')

    res.status(200).json({
      totalIssues,
      totalUsers,
      byStatus: { pending, inProgress, resolved },
      byCategory,
      topIssues
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' })
      .select('-password')
      .sort({ createdAt: -1 })

    res.status(200).json({
      total: users.length,
      users
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllIssues, getStats, getAllUsers }
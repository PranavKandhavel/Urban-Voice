const Issue = require('../models/Issue.model')

// @route  PATCH /api/status/:issueId
const updateStatus = async (req, res) => {
  const { issueId } = req.params
  const { status } = req.body

  const validStatuses = ['Pending', 'In Progress', 'Resolved']

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Use Pending, In Progress or Resolved'
      })
    }

    const issue = await Issue.findById(issueId)
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    issue.status = status
    issue.assignedTo = req.user._id
    await issue.save()

    res.status(200).json({
      message: `Status updated to ${status}`,
      issue: {
        _id: issue._id,
        title: issue.title,
        status: issue.status,
        assignedTo: issue.assignedTo
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/status/:issueId
const getStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .select('title status assignedTo updatedAt')
      .populate('assignedTo', 'name email')

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    res.status(200).json(issue)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { updateStatus, getStatus }
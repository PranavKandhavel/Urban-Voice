const Issue = require('../models/Issue.model')

// @route  POST /api/upvote/:issueId
const toggleUpvote = async (req, res) => {
  const { issueId } = req.params
  const userId = req.user._id

  try {
    const issue = await Issue.findById(issueId)
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    const alreadyUpvoted = issue.upvotedBy.includes(userId)

    if (alreadyUpvoted) {
      issue.upvotedBy = issue.upvotedBy.filter(
        id => id.toString() !== userId.toString()
      )
    } else {
      issue.upvotedBy.push(userId)
    }

    issue.upvoteCount = issue.upvotedBy.length
    issue.priority = issue.upvoteCount * 2
    await issue.save()

    res.status(200).json({
      message: alreadyUpvoted ? 'Upvote removed' : 'Upvote added',
      upvoted: !alreadyUpvoted,
      upvoteCount: issue.upvoteCount,
      priority: issue.priority
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/upvote/:issueId
const getUpvoteStatus = async (req, res) => {
  const { issueId } = req.params
  const userId = req.user._id

  try {
    const issue = await Issue.findById(issueId)
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    const upvoted = issue.upvotedBy.includes(userId)

    res.status(200).json({
      upvoted,
      upvoteCount: issue.upvoteCount
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { toggleUpvote, getUpvoteStatus }
const express = require('express')
const router = express.Router()
const { toggleUpvote, getUpvoteStatus } = require('../controllers/upvote.controller')
const { protect } = require('../middleware/authMiddleware')

router.post('/:issueId', protect, toggleUpvote)
router.get('/:issueId', protect, getUpvoteStatus)

module.exports = router
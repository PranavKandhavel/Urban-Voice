const express = require('express')
const router = express.Router()
const {
  createIssue,
  getIssues,
  getIssueById,
  deleteIssue
} = require('../controllers/issue.controller')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.get('/', protect, getIssues)
router.get('/my', protect, async (req, res) => {
  try {
    const Issue = require('../models/Issue.model');
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
    res.json(issues)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/:id', protect, getIssueById)
router.post('/', protect, (req, res, next) => {
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    req.file = null;
    return next();
  }
  upload.single('photo')(req, res, next);
}, createIssue)
router.delete('/:id', protect, deleteIssue)
module.exports = router

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
router.get('/:id', protect, getIssueById)
router.post('/', protect, upload.single('photo'), createIssue)
router.delete('/:id', protect, deleteIssue)
module.exports = router
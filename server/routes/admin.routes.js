const express = require('express')
const router = express.Router()
const {
  getAllIssues,
  getStats,
  getAllUsers
} = require('../controllers/admin.controller')
const { protect } = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.get('/issues', protect, roleMiddleware('authority'), getAllIssues)
router.get('/stats', protect, roleMiddleware('authority'), getStats)
router.get('/users', protect, roleMiddleware('authority'), getAllUsers)

module.exports = router
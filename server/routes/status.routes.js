const express = require('express')
const router = express.Router()
const { updateStatus, getStatus } = require('../controllers/status.controller')
const { protect } = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.patch('/:issueId', protect, roleMiddleware('authority'), updateStatus)
router.get('/:issueId', protect, getStatus)

module.exports = router
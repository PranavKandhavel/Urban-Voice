const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, phone, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      points: user.points,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      points: user.points,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.status(200).json(user)
}

// @desc Change user password
// @route PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.user.id)

    // Check current password
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect' })
    }

    // Update password (triggers pre-save hash)
    user.password = newPassword
    await user.save()

    // Generate new token
    const token = generateToken(user._id)

    res.status(200).json({
      message: 'Password changed successfully',
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, loginUser, getMe, changePassword }

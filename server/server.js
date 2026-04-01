const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/issues', require('./routes/issue.routes'))
app.use('/api/status', require('./routes/status.routes'))
app.use('/api/upvote', require('./routes/upvote.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

// Health check
app.get('/', (req, res) => res.send('Urban Voice API running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

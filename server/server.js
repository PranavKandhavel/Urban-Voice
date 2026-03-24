const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth.routes'))

// Health check
app.get('/', (req, res) => res.send('Urban Voice API running'))
app.use('/api/issues', require('./routes/issue.routes'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

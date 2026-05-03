const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // loads your .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://task-management-frontend-gamma-indol.vercel.app'
}))
app.use(express.json()); // lets us read JSON from requests
app.use(express.static(path.join(__dirname, 'public'))); // serves frontend files

// Routes (we'll add these soon)
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
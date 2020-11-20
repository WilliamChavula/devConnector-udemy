const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Routes
const userRoutes = require('./routes/api/users');
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

// connect to DB
connectDB();

// routes

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
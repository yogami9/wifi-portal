require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./controllers/userController');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" folder

app.get('/api/paystack-key', (req, res) => {
  res.json({ publicKey: process.env.PAYSTACK_PUBLIC_KEY });
});

// Routes
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Frontend (vanilla HTML/CSS/JS in /public)
app.use(express.static(path.join(__dirname, 'public')));

// Unknown API routes get a JSON 404, everything else falls back to the shop home page.
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, but never let a database failure stop the web server:
// connectDB() catches its own errors, and the server keeps listening so the
// frontend can still be served (API routes then answer with a clear error).
connectDB();
app.listen(PORT, () => {
  console.log(`CodeAlpha E-commerce Store running at http://localhost:${PORT}`);
});

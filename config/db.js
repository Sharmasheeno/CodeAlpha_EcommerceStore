const mongoose = require('mongoose');

// Fail fast instead of buffering queries for a long time when MongoDB is
// unreachable, so API routes can answer with a clean error JSON.
mongoose.set('bufferCommands', false);

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codealpha_ecommerce';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    // The web server must still start and serve the frontend even without a
    // database, so we only log the problem instead of crashing.
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error('Server will keep running; database-backed API routes will return an error until MongoDB is available.');
  }
}

module.exports = connectDB;

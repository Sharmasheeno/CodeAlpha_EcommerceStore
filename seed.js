require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Over-ear Bluetooth headphones with active noise cancellation, 40-hour battery life and a built-in microphone for calls.', price: 89.99, category: 'Electronics', image: 'https://picsum.photos/seed/headphones/600/400', stock: 40, rating: 4.8 },
  { name: 'Smart Watch Series 5', description: 'Fitness and notifications on your wrist: heart-rate tracking, GPS, sleep monitoring and a bright always-on display.', price: 149.5, category: 'Electronics', image: 'https://picsum.photos/seed/smartwatch/600/400', stock: 35, rating: 4.6 },
  { name: 'Portable Bluetooth Speaker', description: 'Compact waterproof speaker with deep bass and up to 12 hours of playtime — perfect for home and outdoors.', price: 45.0, category: 'Electronics', image: 'https://picsum.photos/seed/speaker/600/400', stock: 60, rating: 4.5 },
  { name: 'Smartphone Tripod Stand', description: 'Adjustable aluminium tripod with a phone mount and remote shutter, ideal for photos, videos and video calls.', price: 24.99, category: 'Electronics', image: 'https://picsum.photos/seed/tripod/600/400', stock: 80, rating: 4.3 },
  { name: 'Classic Cotton T-Shirt', description: 'Soft, breathable 100% cotton t-shirt with a regular fit. Available in everyday colours for casual wear.', price: 15.99, category: 'Fashion', image: 'https://picsum.photos/seed/tshirt/600/400', stock: 120, rating: 4.4 },
  { name: 'Running Shoes', description: 'Lightweight running shoes with cushioned soles and breathable mesh, designed for daily training and comfort.', price: 69.99, category: 'Fashion', image: 'https://picsum.photos/seed/shoes/600/400', stock: 55, rating: 4.7 },
  { name: 'Leather Wallet', description: 'Slim genuine-leather wallet with RFID protection, six card slots and a notes compartment.', price: 29.95, category: 'Fashion', image: 'https://picsum.photos/seed/wallet/600/400', stock: 90, rating: 4.6 },
  { name: 'Ceramic Dinner Set (16 pieces)', description: 'Modern stoneware dinner set for four — plates, side plates, bowls and mugs. Dishwasher and microwave safe.', price: 59.99, category: 'Home & Kitchen', image: 'https://picsum.photos/seed/dinnerset/600/400', stock: 25, rating: 4.7 },
  { name: 'Electric Kettle 1.7L', description: 'Fast-boil stainless steel electric kettle with auto shut-off and a removable filter.', price: 32.5, category: 'Home & Kitchen', image: 'https://picsum.photos/seed/kettle/600/400', stock: 45, rating: 4.5 },
  { name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with three colour temperatures and touch dimming — easy on the eyes for study and work.', price: 21.99, category: 'Home & Kitchen', image: 'https://picsum.photos/seed/desklamp/600/400', stock: 70, rating: 4.4 },
  { name: 'Yoga Mat Pro', description: 'Non-slip 6mm yoga and exercise mat with a carry strap. Lightweight, durable and easy to clean.', price: 19.99, category: 'Sports', image: 'https://picsum.photos/seed/yogamat/600/400', stock: 65, rating: 4.6 },
  { name: 'Adjustable Dumbbell 10kg', description: 'Space-saving adjustable dumbbell for home workouts, with quick weight changes from 2.5kg to 10kg.', price: 54.99, category: 'Sports', image: 'https://picsum.photos/seed/dumbbell/600/400', stock: 30, rating: 4.8 },
  { name: 'Insulated Water Bottle 1L', description: 'Stainless steel insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof cap.', price: 17.5, category: 'Sports', image: 'https://picsum.photos/seed/bottle/600/400', stock: 110, rating: 4.5 },
  { name: 'Hardcover Notebook A5', description: 'Premium A5 notebook with 200 ruled pages of thick, ink-friendly paper and a lay-flat binding.', price: 9.99, category: 'Books & Stationery', image: 'https://picsum.photos/seed/notebook/600/400', stock: 150, rating: 4.7 },
  { name: 'Gel Pen Set (12 colours)', description: 'Smooth-writing gel pens in 12 vibrant colours — great for notes, journaling and sketching.', price: 7.99, category: 'Books & Stationery', image: 'https://picsum.photos/seed/pens/600/400', stock: 200, rating: 4.3 }
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codealpha_ecommerce';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for seeding.');

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products.`);

    // Demo customer account (handy for trying login/checkout quickly).
    await User.deleteOne({ email: 'demo@shop.com' });
    const hashed = await bcrypt.hash('demo1234', 10);
    await User.create({ name: 'Demo Customer', email: 'demo@shop.com', password: hashed });
    console.log('Demo user created: demo@shop.com / demo1234');

    await mongoose.disconnect();
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error(`Seeding failed: ${err.message}`);
    console.error('Make sure MongoDB is running and MONGO_URI in .env is correct.');
    process.exit(1);
  }
}

seed();

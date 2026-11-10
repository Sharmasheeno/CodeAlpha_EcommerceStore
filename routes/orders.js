const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/orders  (login required) — place a new order.
// Prices and totals are recomputed on the server from the database, so a
// tampered client-side cart cannot change what the customer is charged.
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, phone, paymentMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    if (!shippingAddress || !phone) {
      return res.status(400).json({ message: 'Shipping address and phone number are required.' });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: 'One of the products in your cart no longer exists.' });
      }
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
      total += product.price * qty;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: Math.round(total * 100) / 100,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ message: 'Could not place the order. Please make sure MongoDB is running.' });
  }
});

// GET /api/orders/my  (login required) — orders of the logged-in user only.
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(503).json({ message: 'Database unavailable. Please make sure MongoDB is running.' });
  }
});

module.exports = router;

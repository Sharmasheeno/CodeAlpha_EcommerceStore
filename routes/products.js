const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

function dbError(res, err) {
  console.error(err.message);
  return res.status(503).json({ message: 'Database unavailable. Please make sure MongoDB is running and seeded.' });
}

// GET /api/products?search=phone&category=Electronics
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    dbError(res, err);
  }
});

// GET /api/products/categories  (distinct category names for the filter dropdown)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    dbError(res, err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    dbError(res, err);
  }
});

module.exports = router;

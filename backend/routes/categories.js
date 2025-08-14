const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}, 'name'); // Return only category names
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get websites for a specific category
router.get('/:category', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.category });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category.websites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Customization: Add POST route to allow admin to add categories/websites via API
// Example: router.post('/add', async (req, res) => { ... })
// For now, use MongoDB Atlas or seed script to manage data

module.exports = router;
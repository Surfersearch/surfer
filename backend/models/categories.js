const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., Tacos, News
  websites: [
    {
      name: { type: String, required: true }, // e.g., Taco Bell
      url: { type: String, required: true }, // e.g., https://www.tacobell.com
      logo: { type: String } // URL to company logo (optional, can be added manually or scraped)
    }
  ]
  // Customization: Add fields like 'description' or 'tags' for future filtering
});

module.exports = mongoose.model('Category', categorySchema);
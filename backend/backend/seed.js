const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Category.deleteMany({}); // Clear existing data
    await Category.insertMany([
      {
        name: 'Tacos',
        websites: [
          { name: 'Taco Bell', url: 'https://www.tacobell.com', logo: 'https://www.tacobell.com/images/logo.png' },
          { name: 'Local Taco', url: 'https://www.thelocaltaco.com', logo: '' }, // Logo can be added later
          { name: 'Taco Time', url: 'https://www.tacotime.com', logo: '' }
        ]
      },
      {
        name: 'Tech',
        websites: [
          { name: 'TechCrunch', url: 'https://techcrunch.com', logo: 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018.png' },
          { name: 'Wired', url: 'https://www.wired.com', logo: '' }
        ]
      }
      // Customization: Add more categories and websites here
      // Example: { name: 'News', websites: [{ name: 'CNN', url: 'https://www.cnn.com', logo: '' }] }
    ]);
    console.log('Categories seeded');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
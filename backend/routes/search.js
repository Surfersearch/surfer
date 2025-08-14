const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const Category = require('../models/Category');

router.post('/item', async (req, res) => {
  const { category, query } = req.body; // e.g., { category: 'Tacos', query: 'beef taco' }
  try {
    const categoryData = await Category.findOne({ name: category });
    if (!categoryData) return res.status(404).json({ error: 'Category not found' });

    const results = [];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const website of categoryData.websites) {
      try {
        await page.goto(website.url, { waitUntil: 'networkidle2' });

        // Simulate search (adjust selector based on website)
        const searchSelector = 'input[type="search"], input[name="q"], input.search'; // Common search input selectors
        const searchInput = await page.$(searchSelector);
        if (searchInput) {
          await page.type(searchSelector, query);
          await page.keyboard.press('Enter');
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
        } else {
          // Fallback: Append query to URL (common for sites like Google)
          await page.goto(`${website.url}/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' });
        }

        // Extract links
        const links = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a'));
          return anchors
            .map(a => ({
              text: a.innerText || '',
              href: a.href
            }))
            .filter(link => link.text && link.href && link.href.startsWith('http')); // Basic filtering
        });

        // Use stored logo or attempt to scrape
        let logo = website.logo;
        if (!logo) {
          logo = await page.evaluate(() => {
            const img = document.querySelector('img[alt*="logo"], img[src*="logo"]');
            return img ? img.src : '';
          });
        }

        results.push({
          website: website.name,
          logo: logo || 'https://via.placeholder.com/100', // Fallback logo
          links: links.slice(0, 5) // Limit to 5 links for simplicity
        });
      } catch (error) {
        results.push({
          website: website.name,
          logo: website.logo || 'https://via.placeholder.com/100',
          links: [{ text: 'Error fetching links', href: website.url }]
        });
      }
    }

    await browser.close();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Customization:
// - Add link filtering logic (e.g., keyword matching) to improve relevance
// - Store scraped logos in MongoDB to avoid repeated scraping
// - Add timeout handling or retry logic for unreliable websites
// - Consider caching search results for performance (e.g., Redis)

module.exports = router;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [websites, setWebsites] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(response => {
        setCategories(response.data);
        if (response.data.length > 0) setCategory(response.data[0].name);
      })
      .catch(error => console.error(error));
  }, []);

  // Fetch websites when category changes
  useEffect(() => {
    if (category) {
      axios.get(`http://localhost:5000/api/categories/${category}`)
        .then(response => setWebsites(response.data))
        .catch(error => console.error(error));
    }
  }, [category]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/search/item', { category, query });
      setResults(response.data);
    } catch (error) {
      alert('Search failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Web Search Assistant</h1>
      <Link to="/auth">Login/Sign Up</Link> | <Link to="/subscribe">Go Premium</Link>
      <div>
        <h2>Select Category</h2>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h2>Websites in {category}</h2>
        <ul>
          {websites.map(website => (
            <li key={website.url}>
              <img src={website.logo || 'https://via.placeholder.com/50'} alt={website.name} width="50" />
              {website.name} - <a href={website.url} target="_blank" rel="noopener noreferrer">{website.url}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Search</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., beef taco"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h2>Results</h2>
        {results.map(result => (
          <div key={result.website} style={{ marginBottom: '20px' }}>
            <h3>{result.website}</h3>
            <img src={result.logo} alt={result.website} width="100" />
            <ul>
              {result.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.text || link.href}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Customization:
// - Add CSS framework (e.g., Tailwind, Bootstrap) for better styling
// - Implement loading states for search and category fetching
// - Add pagination or infinite scroll for large result sets
// - Save searches to user profile (requires MongoDB user schema)

export default Home;
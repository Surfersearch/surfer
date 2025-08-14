import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Subscribe from './components/Subscribe';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/success" element={<h2>Subscription Successful!</h2>} />
        <Route path="/cancel" element={<h2>Subscription Canceled</h2>} />
      </Routes>
    </Router>
  );
}

// Customization:
// - Add protected routes (require login for certain pages)
// - Add a dashboard route for premium users
// - Integrate error boundary for better UX

export default App;

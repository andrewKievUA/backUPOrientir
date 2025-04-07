import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AnalyticsPage from './AnalyticsPage';
import CheckPage from './CheckPage';
import HomePage from './HomePage';
import Filter from './Filter';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        {/* Кнопки для навигации */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <Link to="/">
            <Button variant="outline-dark" style={{ marginRight: '10px' }}>Домашня</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="outline-dark" style={{ marginRight: '10px' }}>Аналітика</Button>
          </Link>
          <Link to="/check">
            <Button variant="outline-dark">Перевірка</Button>
          </Link>
          <Link to="/Filter">
            <Button variant="outline-dark">Filter</Button>
          </Link>
        </div>

        {/* Маршрутизация страниц */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/Filter" element={<Filter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

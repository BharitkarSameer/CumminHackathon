import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CoverPage from './pages/CoverPage';
import UseCases from './pages/UseCases';
import Resources from './pages/Resources';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

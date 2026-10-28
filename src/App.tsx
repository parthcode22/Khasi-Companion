import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Translate from './pages/Translate';
import Explore from './pages/Explore';
import Phrasebook from './pages/Phrasebook';
import Safety from './pages/Safety';
import SystemStatus from './pages/SystemStatus';
import LearnKhasi from './pages/LearnKhasi';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learn/*" element={<LearnKhasi />} />
          <Route path="translate" element={<Translate />} />
          <Route path="explore" element={<Explore />} />
          <Route path="phrasebook" element={<Phrasebook />} />
          <Route path="safety" element={<Safety />} />
          <Route path="system-status" element={<SystemStatus />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
};

export default App;

// AnimatedRoutes.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import your two pages
import InputPage from './ChatBotInput/input';     // Page 1
import OutputPage from './VideoDisplay/Output';  // Page 2

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {/* Page 1 (Input) at path="/input" (or just "/") */}
        <Route path="/" element={<InputPage />} />
        {/* Page 2 (Output) at path="/output" */}
        <Route path="/output" element={<OutputPage />} />
      </Routes>
    </AnimatePresence>
  );
}
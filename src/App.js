import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Lesson from './components/pages/Lesson';
import Enquire from './components/pages/Enquire';
import Quiz from './components/pages/Quiz';
import { checkHealth } from './components/graphql';

function App() {
  useEffect(() => {
    checkHealth()
      .then(console.log)
      .catch(console.error);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/enquire" element={<Enquire />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
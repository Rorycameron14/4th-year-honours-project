import React from 'react';
import { Link } from 'react-router-dom';
import './Herosection.css';

// Hero section structure was based on the Brian Design tutorial homepage and then rewritten around the FOCUSED project.
function HeroSection() {
  return (
    <div className="hero-container">
      <video
        className="hero-video"
        src="/videos/video-1.mp4"
        autoPlay
        loop
        muted
      />

      <div className="hero-content">
        <h1>FOCUSED</h1>
        <p>
          An immersive learning project exploring how background audio
          conditions may affect concentration, engagement, and quiz
          performance.
        </p>

        <div className="hero-btns">
          <Link to="/lesson" className="btn btn-primary">
            Get Started
          </Link>

          <Link to="/about" className="btn btn-outline">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

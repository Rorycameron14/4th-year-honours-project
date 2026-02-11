import React from 'react';
import './Herosection.css';

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
        <p>Get focusing, stay focused.</p>

        <div className="hero-btns">
          <button className="btn btn-primary">
            Get Started
          </button>

          <button className="btn btn-outline">
            <span className="btn-icon">▶</span>
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

import React from 'react';
import './Herosection.css';


function HeroSection() {
    return (
        <div className="hero-container">
            <video src="/videos/video-1.mp4" autoPlay loop muted />
            <h1>FOCUSED</h1>
            <p>Get focusing, stay focused</p>
            <div className="hero-btns">
                <button className="btns" buttonStyle="btn--primary" buttonSize="btn--large">
                    WATCH TRAILER <i className='far fa-play-circle' />
                </button>
            </div>
        </div>
    );
}

export default HeroSection;
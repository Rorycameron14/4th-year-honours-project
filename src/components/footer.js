import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          FOCUSED is an immersive dissertation project investigating how
          different background audio conditions may influence learning and
          concentration.
        </p>
        <p className='footer-subscription-text'>
          Use the links below to move through the lesson, quiz, and project
          information pages.
        </p>
        <div className='footer-cta-group'>
          <Link to='/lesson' className='footer-cta'>
            Start Lesson
          </Link>
          <Link to='/about' className='footer-cta footer-cta--secondary'>
            Project Background
          </Link>
        </div>
      </section>

      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Project</h2>
            <Link to='/about'>About the Study</Link>
            <Link to='/lesson'>Immersive Lesson</Link>
            <Link to='/quiz'>Quiz</Link>
            <Link to='/enquire'>Enquire</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Learning Flow</h2>
            <Link to='/'>Home</Link>
            <Link to='/lesson'>Start Lesson</Link>
            <Link to='/quiz'>Complete Quiz</Link>
            <Link to='/about'>Read More</Link>
          </div>
        </div>

        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Research Focus</h2>
            <Link to='/about'>Audio Conditions</Link>
            <Link to='/about'>ADHD and Dyslexia Context</Link>
            <Link to='/about'>Immersive Environment</Link>
            <Link to='/about'>Data Collection</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Site Links</h2>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/lesson'>Lesson</Link>
            <Link to='/quiz'>Quiz</Link>
          </div>
        </div>
      </div>

      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              FOCUSED
            </Link>
          </div>
          <small className='website-rights'>
            FOCUSED | Immersive Learning Dissertation Project
          </small>
          <div className='social-icons'>
            <Link className='social-icon-link' to='/lesson' aria-label='Lesson'>
              Lesson
            </Link>
            <Link className='social-icon-link' to='/quiz' aria-label='Quiz'>
              Quiz
            </Link>
            <Link className='social-icon-link' to='/about' aria-label='About'>
              About
            </Link>
            <Link
              className='social-icon-link'
              to='/enquire'
              aria-label='Enquire'
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;

// src/components/ReadingCarousel.js
import React, { useState } from 'react';
import './ReadingCarousel.css';

const slides = [
  {
    id: 'intro',
    title: 'Welcome to Ancient Egypt',
    text: `In this lesson, you will explore life in Ancient Egypt. You will see famous places like the pyramids and the Sphinx, and learn how people lived, worked, and travelled thousands of years ago.`,
  },
  {
    id: 'nile',
    title: 'Life by the River Nile',
    text: `Most Ancient Egyptians lived close to the River Nile. The river brought fresh water, food and transport. When the Nile flooded each year, it left rich mud on the fields, which helped farmers grow crops like wheat and barley.`,
  },
  {
    id: 'pharaoh',
    title: 'The Pharaoh',
    text: `The pharaoh was the ruler of Ancient Egypt. People believed the pharaoh was chosen by the gods and had a special role in keeping the land safe and balanced. The pharaoh led the army, made laws, and organised big building projects.`,
  },
  {
    id: 'pyramids',
    title: 'Pyramids and Tombs',
    text: `Pyramids were built as tombs for powerful pharaohs. Inside, there were passageways and hidden rooms that held the pharaoh’s body and precious objects for the afterlife. Building a pyramid took many years and thousands of workers.`,
  },
];

function ReadingCarousel() {
  const [index, setIndex] = useState(0);

  const currentSlide = slides[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="reading-carousel">
      <h2 className="reading-title">Reading Slides</h2>

      <div className="reading-card">
        <h3 className="reading-card-title">{currentSlide.title}</h3>
        <p className="reading-card-text">{currentSlide.text}</p>

        <div className="reading-controls">
          <button
            type="button"
            className="reading-arrow"
            onClick={handlePrev}
          >
            ◀ Previous
          </button>

          <span className="reading-counter">
            Slide {index + 1} of {slides.length}
          </span>

          <button
            type="button"
            className="reading-arrow"
            onClick={handleNext}
          >
            Next ▶
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReadingCarousel;

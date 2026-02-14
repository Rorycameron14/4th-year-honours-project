import React, { useState } from 'react';
import './LessonScene.css';

const egyptHotspots = [
  {
    id: 'sphinx',
    title: 'The Great Sphinx',
    shortLabel: 'Sphinx',
    x: 20,   // left 20% across
    y: 55,   // a bit below vertical centre
    text: `The Sphinx has the body of a lion and the head of a person. It was carved from a single piece of rock over 4,000 years ago.`,
    funFact: `The face of the Sphinx is thought to represent a pharaoh, but no one is completely sure which one.`,
  },
  {
    id: 'great-pyramid',
    title: 'The Great Pyramid',
    shortLabel: 'Great Pyramid',
    x: 60,   // centrally placed big pyramid
    y: 40,
    text: `The Great Pyramid is one of the largest stone buildings ever made. It was a tomb for the pharaoh Khufu.`,
    funFact: `For over 3,800 years, the Great Pyramid was the tallest man-made structure in the world.`,
  },
  {
    id: 'smaller-pyramids',
    title: 'Smaller Pyramids',
    shortLabel: 'Other Pyramids',
    x: 78,   // right-side pyramids
    y: 45,
    text: `Next to the Great Pyramid are other pyramids built for different pharaohs and important people.`,
    funFact: `The shape of a pyramid may have been chosen to help the pharaoh’s spirit climb up to the sun god Ra.`,
  },
  {
    id: 'desert-life',
    title: 'Desert and Daily Life',
    shortLabel: 'Desert',
    x: 70,   // somewhere on the sand area
    y: 75,
    text: `The pyramids stand at the edge of the Sahara Desert. Workers, traders and travellers moved across this hot, dry land.`,
    funFact: `During the day, desert temperatures can be very high, but at night the sand can feel surprisingly cold.`,
  },
];


function LessonScene() {
  const [selectedId, setSelectedId] = useState(egyptHotspots[0]?.id || null);

  const selectedHotspot =
    egyptHotspots.find((h) => h.id === selectedId) || null;

  return (
    <div className="immersive-layout">
      {/* Left panel – topic + list */}
      <div className="panel panel-left">
        <h2>Ancient Egypt Lesson</h2>
        <p className="panel-intro">
          Explore the scene and tap the glowing points to learn about life in
          Ancient Egypt.
        </p>

        <ul className="section-list">
          {egyptHotspots.map((h) => (
            <li key={h.id}>• {h.title}</li>
          ))}
        </ul>
      </div>

      {/* Middle panel – panorama + hotspots */}
      <div className="panel panel-center">
        <h2>Main Scene</h2>
        <div className="panorama-wrapper">
          {/* TODO: put a real panoramic image at /public/images/egypt-panorama.jpg */}
          <img
            src="/images/egypt-panorama.jpg"
            alt="Ancient Egypt scene"
            className="panorama-image"
          />

          {egyptHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className={
                'hotspot' +
                (hotspot.id === selectedId ? ' hotspot--active' : '')
              }
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
              }}
              onClick={() => setSelectedId(hotspot.id)}
            >
              <div className="hotspot-dot" />
            </button>
          ))}
        </div>
      </div>

      {/* Right panel – info */}
      <div className="panel panel-right">
        <h2>Information</h2>

        {selectedHotspot ? (
          <div className="info-card">
            <h3>{selectedHotspot.title}</h3>
            <p className="info-main-text">{selectedHotspot.text}</p>
            <p className="info-fact">
              <strong>Did you know?</strong> {selectedHotspot.funFact}
            </p>
          </div>
        ) : (
          <p className="info-placeholder">
            Tap a glowing point on the Egypt scene to see more information here.
          </p>
        )}
      </div>
    </div>
  );
}

export default LessonScene;

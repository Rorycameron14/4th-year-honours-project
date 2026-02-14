import React, { useState } from 'react';
import './LessonScene.css';

const egyptHotspots = [
  {
    id: 'nile',
    title: 'Life by the Nile',
    shortLabel: 'Nile',
    x: 18, // % from left
    y: 65, // % from top
    text: `Most Ancient Egyptians lived close to the River Nile. It provided fresh water, transport, and rich soil for growing crops.`,
    funFact: `The Nile flooded every year, which helped farmers but could also damage houses if people built too close to the river.`,
  },
  {
    id: 'pyramids',
    title: 'Pyramids & Tombs',
    shortLabel: 'Pyramids',
    x: 65,
    y: 45,
    text: `Pyramids were built as tombs for powerful rulers called pharaohs. Inside, there were passageways, chambers, and treasures for the afterlife.`,
    funFact: `It took thousands of workers many years to build a single pyramid, using ramps, sledges, and simple tools.`,
  },
  {
    id: 'market',
    title: 'Busy Marketplace',
    shortLabel: 'Market',
    x: 40,
    y: 75,
    text: `Markets were noisy, busy places where people traded food, cloth, pottery and tools. Most trading was done by swapping goods rather than using coins.`,
    funFact: `Children often helped in family stalls, learning skills and trades instead of going to school like we do today.`,
  },
  {
    id: 'temple',
    title: 'Temple & Gods',
    shortLabel: 'Temple',
    x: 82,
    y: 35,
    text: `Temples were important religious centres. Priests performed daily rituals to honour the gods and goddesses of Ancient Egypt.`,
    funFact: `Each city often had its own main god. People believed the gods controlled things like the Nile floods, weather, and health.`,
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

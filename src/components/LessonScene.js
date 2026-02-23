// src/components/LessonScene.js
import React, { useState } from 'react';
import './LessonScene.css';
import './ReadingCarousel.css';

const scenes = [
  {
    id: 'giza',
    name: 'Giza Pyramids',
    image: '/images/egypt-panorama.jpg',
    hotspots: [
      {
        id: 'sphinx',
        title: 'The Great Sphinx',
        shortLabel: 'Sphinx',
        x: 20,
        y: 55,
        text: `The Sphinx has the body of a lion and the head of a person. It was carved from a single piece of rock over 4,000 years ago.`,
        funFact: `The face of the Sphinx is thought to represent a pharaoh, but no one is completely sure which one.`,
      },
      {
        id: 'great-pyramid',
        title: 'The Great Pyramid',
        shortLabel: 'Great Pyramid',
        x: 63,
        y: 20,
        text: `The Great Pyramid is one of the largest stone buildings ever made. It was a tomb for the pharaoh Khufu.`,
        funFact: `For over 3,800 years, the Great Pyramid was the tallest man-made structure in the world.`,
      },
      {
        id: 'smaller-pyramids',
        title: 'Smaller Pyramids',
        shortLabel: 'Other Pyramids',
        x: 63,
        y: 50,
        text: `Next to the Great Pyramid are other pyramids built for different pharaohs and important people.`,
        funFact: `The shape of a pyramid may have been chosen to help the pharaoh’s spirit climb up to the sun god Ra.`,
      },
      {
        id: 'desert-life',
        title: 'Desert and Daily Life',
        shortLabel: 'Desert',
        x: 70,
        y: 75,
        text: `The pyramids stand at the edge of the Sahara Desert. Workers, traders and travellers moved across this hot, dry land.`,
        funFact: `During the day, desert temperatures can be very high, but at night the sand can feel surprisingly cold.`,
      },
    ],
  },
  {
    id: 'nile',
    name: 'The River Nile',
    image: '/images/egypt-nile.jpg', // you can reuse the same image for now if needed
    hotspots: [
      {
        id: 'farming',
        title: 'Farming by the Nile',
        shortLabel: 'Farming',
        x: 25,
        y: 65,
        text: `The Nile’s yearly floods left rich mud on the fields. Farmers used this soil to grow crops like wheat, barley, and vegetables.`,
        funFact: `If the Nile flood was too small or too big, it could cause hunger or destroy homes and fields.`,
      },
      {
        id: 'boats',
        title: 'Boats and Transport',
        shortLabel: 'Boats',
        x: 60,
        y: 50,
        text: `Boats travelled up and down the Nile carrying people, animals, and goods. The river was like a busy motorway for Ancient Egypt.`,
        funFact: `Some boats were made from bundles of reeds, while larger ones were built from wood and had sails.`,
      },
      {
        id: 'villages',
        title: 'Villages and Homes',
        shortLabel: 'Villages',
        x: 75,
        y: 60,
        text: `Many villages were built close to the river so people could collect water, fish, and trade more easily.`,
        funFact: `Houses were often made from sun-dried mud bricks, which helped keep them cool inside.`,
      },
    ],
  },
  {
    id: 'temple',
    name: 'Temples and Gods',
    image: '/images/egypt-temple.jpg',
    hotspots: [
      {
        id: 'statues',
        title: 'Statues of the Gods',
        shortLabel: 'Statues',
        x: 30,
        y: 55,
        text: `Inside temples, there were statues of the gods that people came to visit. Priests looked after these statues with special rituals.`,
        funFact: `The Egyptians believed the statue was a home for the god’s spirit when it visited the temple.`,
      },
      {
        id: 'wall-paintings',
        title: 'Wall Paintings',
        shortLabel: 'Paintings',
        x: 60,
        y: 40,
        text: `Temple walls were covered with colourful pictures and symbols. These showed stories of the gods, pharaohs, and important events.`,
        funFact: `The colours were made from ground-up minerals like copper and iron mixed with plant gum or egg.`,
      },
      {
        id: 'offerings',
        title: 'Offerings and Rituals',
        shortLabel: 'Offerings',
        x: 70,
        y: 65,
        text: `People brought offerings like bread, fruit, flowers, and oils to thank the gods and ask for protection.`,
        funFact: `Offerings were often left on stone tables, and the smell of incense was used to please the gods.`,
      },
    ],
  },
];

function LessonScene() {
  // which scene we are on (0 = first, 1 = second, etc.)
  const [sceneIndex, setSceneIndex] = useState(0);
  // which hotspot in the CURRENT scene is selected
  const [selectedId, setSelectedId] = useState(
    scenes[0].hotspots[0]?.id || null
  );

  const currentScene = scenes[sceneIndex];

  const selectedHotspot =
    currentScene.hotspots.find((h) => h.id === selectedId) || null;

  const handleNextScene = () => {
    setSceneIndex((prev) => {
      const next = (prev + 1) % scenes.length;
      const firstHotspot = scenes[next].hotspots[0];
      setSelectedId(firstHotspot ? firstHotspot.id : null);
      return next;
    });
  };

  const handlePrevScene = () => {
    setSceneIndex((prev) => {
      const next = prev === 0 ? scenes.length - 1 : prev - 1;
      const firstHotspot = scenes[next].hotspots[0];
      setSelectedId(firstHotspot ? firstHotspot.id : null);
      return next;
    });
  };

  return (
    <div className="immersive-layout">
      {/* Left panel – lesson + list */}
      <div className="panel panel-left">
        <h2>Ancient Egypt Lesson</h2>
        <p className="panel-intro">
          Explore each scene and tap the glowing points to learn about life in
          Ancient Egypt.
        </p>
        <p className="panel-intro">
          You are viewing: <strong>{currentScene.name}</strong> (scene{' '}
          {sceneIndex + 1} of {scenes.length})
        </p>

        <ul className="section-list">
          {currentScene.hotspots.map((h) => (
            <li key={h.id}>• {h.title}</li>
          ))}
        </ul>
      </div>

      {/* Middle panel – image + hotspots + arrows */}
      <div className="panel panel-center">
        <div className="scene-switcher">
          <button
            type="button"
            onClick={handlePrevScene}
            className="scene-btn"
          >
            ◀ Previous scene
          </button>
          <span className="scene-name">{currentScene.name}</span>
          <button
            type="button"
            onClick={handleNextScene}
            className="scene-btn"
          >
            Next scene ▶
          </button>
        </div>

        <div className="panorama-wrapper">
          <img
            src={currentScene.image}
            alt={currentScene.name}
            className="panorama-image"
          />

          {currentScene.hotspots.map((hotspot) => (
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

      {/* Right panel – info for selected hotspot */}
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
            Tap a glowing point on the scene to see more information here.
          </p>
        )}
      </div>
    </div>
  );
}

export default LessonScene;

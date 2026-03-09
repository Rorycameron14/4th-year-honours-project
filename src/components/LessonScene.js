// src/components/LessonScene.js
import React, { useState } from 'react';
import './LessonScene.css';

const walls = [
  {
    id: 'left',
    name: 'Giza Pyramids',
    image: '/images/egypt-panorama.jpg',
    hotspots: [
      {
        id: 'sphinx',
        x: 22,
        y: 60,
        title: 'The Great Sphinx',
        text: 'The Sphinx has the body of a lion and the head of a person. It was carved from a single piece of rock over 4,000 years ago.',
        funFact: 'The face may represent a pharaoh, but no one is completely sure which one.',
      },
      {
        id: 'great-pyramid',
        x: 66,
        y: 28,
        title: 'The Great Pyramid',
        text: 'The Great Pyramid is one of the largest stone buildings ever made. It was a tomb for the pharaoh Khufu.',
        funFact: 'For over 3,800 years, it was the tallest man-made structure in the world.',
      },
      {
        id: 'workers',
        x: 72,
        y: 72,
        title: 'Workers and Builders',
        text: 'Thousands of workers helped build pyramids. Many were skilled labourers who worked in teams and were given food and shelter.',
        funFact: 'Evidence suggests many workers were not slaves but paid and organised by the state.',
      },
      {
        id: 'desert-edge',
        x: 55,
        y: 86,
        title: 'Desert Edge',
        text: 'The pyramids sit at the edge of the Sahara Desert. The dry desert helped preserve stone structures for thousands of years.',
        funFact: 'Desert temperatures can be very hot in the day and surprisingly cold at night.',
      },
    ],
  },
  {
    id: 'center',
    name: 'The River Nile',
    image: '/images/egypt-nile.jpg',
    hotspots: [
      {
        id: 'farming',
        x: 25,
        y: 72,
        title: 'Farming by the Nile',
        text: 'The Nile’s floods left rich mud on the land. Farmers used it to grow crops like wheat, barley, and vegetables.',
        funFact: 'If floods were too small or too big, it could cause hunger or damage fields.',
      },
      {
        id: 'boats',
        x: 73,
        y: 70,
        title: 'Boats and Transport',
        text: 'Boats travelled up and down the Nile carrying people and goods. The river was like a busy motorway.',
        funFact: 'Some boats were made from reeds, while larger ones were built from wood with sails.',
      },
      {
        id: 'wildlife',
        x: 48,
        y: 78,
        title: 'Animals and Wildlife',
        text: 'The Nile supported lots of wildlife. People fished, hunted birds, and used plants like papyrus to make everyday items.',
        funFact: 'Papyrus was used to make paper-like sheets for writing and record keeping.',
      },
      {
        id: 'flooding',
        x: 52,
        y: 55,
        title: 'Yearly Flooding',
        text: 'Each year the Nile flooded and then retreated. This cycle shaped the calendar and helped decide when to plant and harvest crops.',
        funFact: 'Ancient Egyptians measured flood levels to predict good or bad harvests.',
      },
    ],
  },
  {
    id: 'right',
    name: 'Temples and Gods',
    image: '/images/egypt-temple.jpg',
    hotspots: [
      {
        id: 'statues',
        x: 52,
        y: 60,
        title: 'Statues of the Gods',
        text: 'Temples contained statues of gods. Priests performed rituals to care for them.',
        funFact: 'Egyptians believed statues could be a home for a god’s spirit when visiting the temple.',
      },
      {
        id: 'wall-paintings',
        x: 65,
        y: 35,
        title: 'Wall Paintings',
        text: 'Temple walls were covered with symbols and pictures showing stories of gods and pharaohs.',
        funFact: 'Colours were made from ground minerals mixed with binders like plant gum or egg.',
      },
      {
        id: 'offerings',
        x: 60,
        y: 78,
        title: 'Offerings and Rituals',
        text: 'People brought offerings like bread, fruit, flowers, and oils to thank the gods and ask for protection.',
        funFact: 'Incense was often burned in temples as part of ceremonies.',
      },
      {
        id: 'priests',
        x: 40,
        y: 62,
        title: 'Priests in Temples',
        text: 'Priests were trained to run temple ceremonies, keep the temple clean, and perform daily rituals.',
        funFact: 'Some temples also acted like storehouses and centres of local wealth.',
      },
    ],
  },
];

function LessonScene() {
  const [active, setActive] = useState(null);
  // active shape: { wallId, hotspot }

  const closePopup = () => setActive(null);

  return (
    <div className="immersive-wall" onPointerDown={() => closePopup()}>
      {walls.map((wall) => (
        <div
          key={wall.id}
          className={`wall-panel wall-panel--${wall.id}`}
          onPointerDown={(e) => e.stopPropagation()} // don't close when tapping inside panel
        >
          <img className="wall-image" src={wall.image} alt={wall.name} />

          {wall.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className={
                'hotspot' +
                (active?.wallId === wall.id && active?.hotspot?.id === hotspot.id
                  ? ' hotspot--active'
                  : '')
              }
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive({ wallId: wall.id, hotspot });
              }}
            >
              <div className="hotspot-dot" />
            </button>
          ))}

          {/* Pop-up (game style) */}
          {active?.wallId === wall.id && active?.hotspot && (
            <div
              className="hotspot-popup"
              style={{
                left: `${active.hotspot.x}%`,
                top: `${active.hotspot.y}%`,
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                className="popup-close"
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
              >
                ✕
              </button>

              <div className="popup-title">{active.hotspot.title}</div>
              <div className="popup-text">{active.hotspot.text}</div>
              <div className="popup-fact">
                <strong>Did you know?</strong> {active.hotspot.funFact}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LessonScene;
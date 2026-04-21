import React, { useEffect, useRef, useState } from 'react';
import './LessonScene.css';
import { startSession, logHotspot } from './graphql';

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
        funFact:
          'The face may represent a pharaoh, but no one is completely sure which one.',
      },
      {
        id: 'great-pyramid',
        x: 66,
        y: 28,
        title: 'The Great Pyramid',
        text: 'The Great Pyramid is one of the largest stone buildings ever made. It was a tomb for the pharaoh Khufu.',
        funFact:
          'For over 3,800 years, it was the tallest man-made structure in the world.',
      },
      {
        id: 'workers',
        x: 72,
        y: 72,
        title: 'Workers and Builders',
        text: 'Thousands of workers helped build pyramids. Many were skilled labourers who worked in teams and were given food and shelter.',
        funFact:
          'Evidence suggests many workers were not slaves but paid and organised by the state.',
      },
      {
        id: 'desert-edge',
        x: 55,
        y: 86,
        title: 'Desert Edge',
        text: 'The pyramids sit at the edge of the Sahara Desert. The dry desert helped preserve stone structures for thousands of years.',
        funFact:
          'Desert temperatures can be very hot in the day and surprisingly cold at night.',
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
        text: "The Nile's floods left rich mud on the land. Farmers used it to grow crops like wheat, barley, and vegetables.",
        funFact:
          'If floods were too small or too big, it could cause hunger or damage fields.',
      },
      {
        id: 'boats',
        x: 73,
        y: 70,
        title: 'Boats and Transport',
        text: 'Boats travelled up and down the Nile carrying people and goods. The river was like a busy motorway.',
        funFact:
          'Some boats were made from reeds, while larger ones were built from wood with sails.',
      },
      {
        id: 'wildlife',
        x: 48,
        y: 78,
        title: 'Animals and Wildlife',
        text: 'The Nile supported lots of wildlife. People fished, hunted birds, and used plants like papyrus to make everyday items.',
        funFact:
          'Papyrus was used to make paper-like sheets for writing and record keeping.',
      },
      {
        id: 'flooding',
        x: 52,
        y: 55,
        title: 'Yearly Flooding',
        text: 'Each year the Nile flooded and then retreated. This cycle shaped the calendar and helped decide when to plant and harvest crops.',
        funFact:
          'Ancient Egyptians measured flood levels to predict good or bad harvests.',
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
        funFact:
          "Egyptians believed statues could be a home for a god's spirit when visiting the temple.",
      },
      {
        id: 'wall-paintings',
        x: 65,
        y: 35,
        title: 'Wall Paintings',
        text: 'Temple walls were covered with symbols and pictures showing stories of gods and pharaohs.',
        funFact:
          'Colours were made from ground minerals mixed with binders like plant gum or egg.',
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

const SOUND_OPTIONS = {
  silence: '',
  white: '/audio/White_noise.mp3',
  egyptian: '/audio/Egyptian_track.mp3',
};

function LessonScene() {
  // Session and audio condition are restored so the participant can continue if they refresh or return to the page.
  const storedSessionId = localStorage.getItem('sessionId') || '';
  const storedAudioCondition =
    localStorage.getItem('audioCondition') || 'silence';

  const [active, setActive] = useState(null);
  const [selectedSound, setSelectedSound] = useState(storedAudioCondition);
  const [hasStarted, setHasStarted] = useState(Boolean(storedSessionId));
  const [showSoundMenu, setShowSoundMenu] = useState(!storedSessionId);
  const [sessionId, setSessionId] = useState(storedSessionId);

  const audioRef = useRef(null);

  const closePopup = () => setActive(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // The lesson content stays the same across conditions; only the chosen background audio changes.
    if (!hasStarted || selectedSound === 'silence') {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    audio.pause();
    audio.src = SOUND_OPTIONS[selectedSound];
    audio.loop = true;
    audio.volume = 0.35;
    audio.load();

    audio.play().catch((err) => {
      console.log('Audio playback blocked:', err);
    });
  }, [selectedSound, hasStarted]);

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Lock scrolling while the immersive layout is active so the three-panel scene fills the viewport cleanly.
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const handleStart = async () => {
    if (sessionId) {
      localStorage.setItem('audioCondition', selectedSound);
      setHasStarted(true);
      setShowSoundMenu(false);
      return;
    }

    try {
      // A session starts as soon as the lesson begins so hotspot interactions can be tied to the same participant run.
      const session = await startSession('', '', selectedSound);

      setSessionId(session.id);
      localStorage.setItem('sessionId', session.id);
      localStorage.setItem('audioCondition', selectedSound);
      localStorage.removeItem('participantCode');
      localStorage.removeItem('group');

      setHasStarted(true);
      setShowSoundMenu(false);
    } catch (err) {
      console.error('Failed to start session:', err);
      alert('Could not start session. Check the console.');
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {showSoundMenu && !hasStarted && (
        <div
          className="sound-menu-overlay"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            className="sound-menu"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h2>Which sound are you playing?</h2>

            <label>
              <input
                type="radio"
                name="sound"
                value="silence"
                checked={selectedSound === 'silence'}
                onChange={(e) => setSelectedSound(e.target.value)}
              />
              Silence
            </label>

            <label>
              <input
                type="radio"
                name="sound"
                value="white"
                checked={selectedSound === 'white'}
                onChange={(e) => setSelectedSound(e.target.value)}
              />
              White Noise
            </label>

            <label>
              <input
                type="radio"
                name="sound"
                value="egyptian"
                checked={selectedSound === 'egyptian'}
                onChange={(e) => setSelectedSound(e.target.value)}
              />
              Egyptian Themed
            </label>

            <button type="button" onClick={handleStart}>
              Start Experience
            </button>
          </div>
        </div>
      )}

      <div className="immersive-wall" onPointerDown={() => closePopup()}>
        {walls.map((wall) => (
          <div
            key={wall.id}
            className={`wall-panel wall-panel--${wall.id}`}
            onPointerDown={(e) => e.stopPropagation()}
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
                    : '') +
                  (hotspot.x <= 18 ? ' hotspot--edge-left' : '') +
                  (hotspot.x >= 82 ? ' hotspot--edge-right' : '') +
                  (hotspot.y <= 22 ? ' hotspot--edge-top' : '') +
                  (hotspot.y >= 78 ? ' hotspot--edge-bottom' : '')
                }
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onPointerDown={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive({ wallId: wall.id, hotspot });

                  try {
                    // Hotspot clicks are logged immediately so the lesson can be analysed without waiting for the quiz stage.
                    const currentSessionId =
                      sessionId || localStorage.getItem('sessionId');

                    if (currentSessionId) {
                      await logHotspot(currentSessionId, wall.id, hotspot.id);
                    }
                  } catch (err) {
                    console.error('Failed to log hotspot:', err);
                  }
                }}
              >
                <div className="hotspot-dot" />
              </button>
            ))}

            {active?.wallId === wall.id && active?.hotspot && (
              <div
                className={
                  'hotspot-popup' +
                  (active.hotspot.x <= 18 ? ' hotspot-popup--align-left' : '') +
                  (active.hotspot.x >= 82 ? ' hotspot-popup--align-right' : '') +
                  (active.hotspot.y <= 22 ? ' hotspot-popup--below' : '') +
                  (active.hotspot.y >= 78 ? ' hotspot-popup--raised' : '')
                }
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
                  x
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
    </>
  );
}

export default LessonScene;

import React, { useEffect, useRef, useState } from 'react';
import {
  submitAnswer,
  endSession,
  updateSessionDetails,
  startSession,
} from './graphql';
import './QuizSection.css';

// Runs the post-lesson quiz and records participant performance data for dissertation analysis.
const QUESTIONS = [
  {
    id: 'q1_nile_civilisation',
    question:
      'Which explanation best shows why the River Nile was central to the development of Ancient Egyptian civilisation?',
    options: [
      'It prevented any form of drought or food shortage from taking place',
      'It supplied all the stone needed to build pyramids and temples',
      'It created fertile land, supported agriculture, and acted as a major transport route',
      'It provided a natural barrier that completely isolated Egypt from all outside influence',
    ],
    correctIndex: 2,
  },
  {
    id: 'q2_pyramid_workers',
    question:
      'What does the lesson suggest about pyramid construction and the organisation of labour in Ancient Egypt?',
    options: [
      'The pyramids were probably built through organised teams of skilled workers who were supported with food, shelter, and state planning',
      'The pyramids were mainly built by isolated families working independently without central organisation',
      'The pyramids were simple structures that required little planning because the desert preserved them naturally',
      'The pyramids were mostly constructed by foreign soldiers because Egyptian workers lacked building skills',
    ],
    correctIndex: 0,
  },
  {
    id: 'q3_nile_flooding',
    question:
      'Why did the yearly flooding of the Nile create both an opportunity and a risk for Ancient Egyptian farming?',
    options: [
      'The flood deposited nutrient-rich soil for crops, but flood levels that were too high or too low could damage fields or cause hunger',
      'The flood permanently cooled the desert, but it also stopped boats from travelling along the river',
      'The flood brought building stone to farmland, but it prevented farmers from growing wheat or barley',
      'The flood removed the need for harvest planning, but it made temples less important to local communities',
    ],
    correctIndex: 0,
  },
  {
    id: 'q4_great_pyramid_power',
    question:
      'Why is the Great Pyramid useful evidence for understanding both engineering ability and political power in Ancient Egypt?',
    options: [
      'Its scale suggests advanced construction knowledge as well as the authority to organise labour, resources, and planning over a long period',
      'Its desert location proves that Egyptian leaders avoided using the Nile for transport or organisation',
      'Its survival proves that it was easy to build and therefore required little specialist knowledge',
      'Its purpose as a tomb shows that pharaohs had religious importance but no political authority',
    ],
    correctIndex: 0,
  },
  {
    id: 'q5_temples_society',
    question:
      'What does the role of temples suggest about the relationship between religion, work, and local society in Ancient Egypt?',
    options: [
      'Temples were spiritual centres where priests performed rituals, but they could also hold wealth, goods, and local social importance',
      'Temples were mainly defensive buildings, and religious activity happened only inside private homes',
      'Temples were decorative spaces with paintings and statues, but they had no connection to daily life or local power',
      'Temples were used only by farmers during the Nile flood and had no role outside the harvest season',
    ],
    correctIndex: 0,
  },
  {
    id: 'q6_papyrus',
    question:
      'Which conclusion is best supported by the Ancient Egyptian use of papyrus?',
    options: [
      'Written communication and record-keeping were important enough that natural resources from the Nile were turned into writing materials',
      'Papyrus shows that Ancient Egyptians had no need for stone inscriptions, wall paintings, or temple symbols',
      'Papyrus was mainly used to build boats, which means writing was probably rare and unimportant',
      'Papyrus proves that farming was separate from administration because plants were not used for practical tasks',
    ],
    correctIndex: 0,
  },
  {
    id: 'q7_desert_location',
    question:
      'Why was the desert-edge location of the pyramids historically significant?',
    options: [
      'The dry desert environment helped preserve stone structures, making them more likely to survive for thousands of years',
      'The desert made construction easier because workers did not need food, shelter, or organised teams',
      'The desert location meant pyramids were hidden from nearby communities and had little connection to pharaohs',
      'The desert prevented temperature changes, so the structures avoided all natural damage over time',
    ],
    correctIndex: 0,
  },
];

function QuizSection() {
  const [sessionId, setSessionId] = useState('');
  const [participantCode, setParticipantCode] = useState('');
  const [group, setGroup] = useState('');
  const [audioCondition, setAudioCondition] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');

  const startedAtRef = useRef(Date.now());

  const current = QUESTIONS[index];

  useEffect(() => {
    // The quiz reuses the session created in the lesson so performance data and interaction data stay linked.
    const savedSessionId = localStorage.getItem('sessionId') || '';
    const savedParticipantCode = localStorage.getItem('participantCode') || '';
    const savedGroup = localStorage.getItem('group') || '';
    const savedAudioCondition = localStorage.getItem('audioCondition') || '';

    setSessionId(savedSessionId);
    setParticipantCode(savedParticipantCode);
    setGroup(savedGroup);
    setAudioCondition(savedAudioCondition);
    setDetailsSaved(
      !!savedParticipantCode && !!savedGroup && !!savedAudioCondition
    );
  }, []);

  useEffect(() => {
    // Response time is measured per question, so the timer resets whenever the question index changes.
    startedAtRef.current = Date.now();
    setSelected(null);
  }, [index]);

  const storeParticipantDetails = (nextSessionId) => {
    localStorage.setItem('sessionId', nextSessionId);
    localStorage.setItem('participantCode', participantCode);
    localStorage.setItem('group', group);
    localStorage.setItem('audioCondition', audioCondition);
  };

  const handleSaveDetails = async () => {
    if (!sessionId) {
      setError('No active session found. Please start the lesson first.');
      return;
    }

    if (!participantCode.trim()) {
      setError('Please enter a participant ID.');
      return;
    }

    if (!group) {
      setError('Please select a participant group.');
      return;
    }

    if (!audioCondition) {
      setError('Please select the sound used.');
      return;
    }

    try {
      // These details are stored once here so they can be reused in the completion screen and the exported data.
      await updateSessionDetails(
        sessionId,
        participantCode,
        group,
        audioCondition
      );

      storeParticipantDetails(sessionId);
      setDetailsSaved(true);
      setError('');
    } catch (err) {
      console.error('Failed to save participant details:', err);

      if (err.message === 'Session not found') {
        try {
          // If an old session ID is still in localStorage, create a fresh session so the participant can continue.
          const session = await startSession(
            participantCode,
            group,
            audioCondition
          );

          setSessionId(session.id);
          storeParticipantDetails(session.id);
          setDetailsSaved(true);
          setError('');
          return;
        } catch (retryErr) {
          console.error('Failed to create a new session:', retryErr);
        }
      }

      setError('Could not save participant details. Please restart the lesson.');
    }
  };

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    if (!sessionId) {
      setError('No active session found. Please start the lesson first.');
      return;
    }

    if (selected === null) {
      setError('Please select an answer before continuing.');
      return;
    }

    try {
      setIsSubmitting(true);

      const responseTimeMs = Date.now() - startedAtRef.current;
      const isCorrect = selected === current.correctIndex;
      const newScore = score + (isCorrect ? 1 : 0);

      // Logging each answer separately makes it possible to analyse both accuracy and timing afterwards.
      await submitAnswer(
        sessionId,
        current.id,
        selected,
        isCorrect,
        responseTimeMs
      );

      setScore(newScore);
      setError('');

      if (index === QUESTIONS.length - 1) {
        // The session is only closed after the final answer so the stored score reflects the completed quiz.
        await endSession(sessionId, newScore);

        localStorage.removeItem('sessionId');
        localStorage.removeItem('participantCode');
        localStorage.removeItem('group');
        localStorage.removeItem('audioCondition');

        setFinished(true);
        return;
      }

      setIndex(index + 1);
    } catch (err) {
      console.error('Failed to submit quiz answer:', err);
      setError('Could not save your answer. Check the console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionId && !finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h1 className="quiz-title">Quiz</h1>
          <p className="quiz-subtitle">No active lesson session found.</p>
          <p className="quiz-meta">
            Start the lesson first, then open the quiz.
          </p>
        </div>
      </div>
    );
  }

  if (!detailsSaved && !finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h1 className="quiz-title">Participant Details</h1>
          <p className="quiz-subtitle">
            Enter the participant ID, group, and sound used before starting the
            quiz.
          </p>

          <input
            className="quiz-input"
            value={participantCode}
            onChange={(e) => setParticipantCode(e.target.value)}
            placeholder="Participant ID (e.g. P01)"
          />

          <select
            className="quiz-input"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">Select participant group</option>
            <option value="ADHD">ADHD</option>
            <option value="Dyslexia">Dyslexia</option>
            <option value="Control">Control</option>
          </select>

          <select
            className="quiz-input"
            value={audioCondition}
            onChange={(e) => setAudioCondition(e.target.value)}
          >
            <option value="">Select sound used</option>
            <option value="silence">Silence</option>
            <option value="white">White Noise</option>
            <option value="egyptian">Egyptian Themed</option>
          </select>

          {error && <p className="quiz-meta">{error}</p>}

          <button
            type="button"
            className="quiz-primary"
            onClick={handleSaveDetails}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h1 className="quiz-title">Done</h1>
          <p className="quiz-subtitle">
            Score: <strong>{score}</strong> / {QUESTIONS.length}
          </p>
          <p className="quiz-meta">Participant: {participantCode}</p>
          <p className="quiz-meta">Group: {group}</p>
          <p className="quiz-meta">Audio: {audioCondition}</p>
          <p className="quiz-meta">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-card">
        <p className="quiz-meta">
          Question {index + 1} of {QUESTIONS.length}
        </p>

        <p className="quiz-meta">
          Participant: {participantCode} | Audio: {audioCondition}
        </p>

        <h1 className="quiz-title">{current.question}</h1>

        <div className="quiz-options">
          {current.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={
                'quiz-option' + (selected === i ? ' quiz-option--selected' : '')
              }
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          ))}
        </div>

        {error && <p className="quiz-meta">{error}</p>}

        <button
          type="button"
          className="quiz-primary"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : index === QUESTIONS.length - 1
              ? 'Finish'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default QuizSection;

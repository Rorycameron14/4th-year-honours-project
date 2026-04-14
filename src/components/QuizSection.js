import React, { useEffect, useRef, useState } from "react";
import { submitAnswer, endSession, updateSessionDetails } from "./graphql";
import "./QuizSection.css";

const QUESTIONS = [
  {
    id: "q1_nile_civilisation",
    question:
      "Which explanation best shows why the River Nile was central to the development of Ancient Egyptian civilisation?",
    options: [
      "It prevented any form of drought or food shortage from taking place",
      "It supplied all the stone needed to build pyramids and temples",
      "It created fertile land, supported agriculture, and acted as a major transport route",
      "It provided a natural barrier that completely isolated Egypt from all outside influence",
    ],
    correctIndex: 2,
  },
  {
    id: "q2_pyramid_workers",
    question:
      "What does the evidence presented in the lesson suggest about the workers who built the pyramids?",
    options: [
      "They were often organised labourers who worked in teams and received support such as food and shelter",
      "They were foreign soldiers sent to Egypt by neighbouring kingdoms",
      "They were mainly enslaved people forced to work without organisation",
      "They were untrained villagers who worked only in emergency situations",
    ],
    correctIndex: 0,
  },
  {
    id: "q3_nile_flooding",
    question:
      "Which statement best explains why the yearly flooding of the Nile was important to farming?",
    options: [
      "It stopped wild animals from approaching farmland",
      "It made the desert permanently cooler and easier to live in",
      "It deposited nutrient-rich soil that helped crops to grow",
      "It allowed farmers to avoid using tools during harvest",
    ],
    correctIndex: 2,
  },
  {
    id: "q4_great_pyramid_power",
    question:
      "Why can the Great Pyramid be seen as evidence of both engineering skill and political power?",
    options: [
      "It shows that Egyptian society depended entirely on foreign architects",
      "It demonstrates the ability to organise resources, labour, and planning on a very large scale",
      "It proves that religion had no influence on Egyptian building projects",
      "It was built mainly for decoration and had little social importance",
    ],
    correctIndex: 1,
  },
  {
    id: "q5_temples_society",
    question:
      "What does the role of temples in Ancient Egypt suggest about Egyptian society?",
    options: [
      "Temples were mainly military buildings used to defend settlements",
      "Priests had no organised duties beyond caring for statues",
      "Religion and daily life were closely connected, and temples had both spiritual and local importance",
      "Temples were used only for private prayer and had no wider function",
    ],
    correctIndex: 2,
  },
  {
    id: "q6_papyrus",
    question:
      "Which conclusion can be drawn from the use of papyrus in Ancient Egypt?",
    options: [
      "Writing was limited entirely to religious ceremonies",
      "Egyptian society had no need for written communication",
      "Papyrus was used mainly for building materials rather than communication",
      "Record-keeping and administration were likely to have been important parts of daily life",
    ],
    correctIndex: 3,
  },
  {
    id: "q7_desert_location",
    question:
      "Why was the desert location of the pyramids historically significant?",
    options: [
      "The dry environment helped preserve structures for long periods of time",
      "It reduced the need for workers during construction",
      "It made them easier to hide from foreign enemies",
      "It allowed builders to transport stone by boat more easily",
    ],
    correctIndex: 0,
  },
];

function QuizSection() {
  const [sessionId, setSessionId] = useState("");
  const [participantCode, setParticipantCode] = useState("");
  const [group, setGroup] = useState("");
  const [audioCondition, setAudioCondition] = useState("");
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  const startedAtRef = useRef(Date.now());

  const current = QUESTIONS[index];

  useEffect(() => {
    const savedSessionId = localStorage.getItem("sessionId") || "";
    const savedParticipantCode = localStorage.getItem("participantCode") || "";
    const savedGroup = localStorage.getItem("group") || "";
    const savedAudioCondition = localStorage.getItem("audioCondition") || "";

    setSessionId(savedSessionId);
    setParticipantCode(savedParticipantCode);
    setGroup(savedGroup);
    setAudioCondition(savedAudioCondition);
    setDetailsSaved(
      !!savedParticipantCode && !!savedGroup && !!savedAudioCondition
    );
  }, []);

  useEffect(() => {
    startedAtRef.current = Date.now();
    setSelected(null);
  }, [index]);

  const handleSaveDetails = async () => {
    if (!sessionId) {
      setError("No active session found. Please start the lesson first.");
      return;
    }

    if (!participantCode.trim()) {
      setError("Please enter a participant ID.");
      return;
    }

    if (!group) {
      setError("Please select a participant group.");
      return;
    }

    if (!audioCondition) {
      setError("Please select the sound used.");
      return;
    }

    try {
      await updateSessionDetails(
        sessionId,
        participantCode,
        group,
        audioCondition
      );

      localStorage.setItem("participantCode", participantCode);
      localStorage.setItem("group", group);
      localStorage.setItem("audioCondition", audioCondition);

      setDetailsSaved(true);
      setError("");
    } catch (err) {
      console.error("Failed to save participant details:", err);
      setError("Could not save participant details. Check the console.");
    }
  };

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    if (!sessionId) {
      setError("No active session found. Please start the lesson first.");
      return;
    }

    if (selected === null) {
      setError("Please select an answer before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const responseTimeMs = Date.now() - startedAtRef.current;
      const isCorrect = selected === current.correctIndex;
      const newScore = score + (isCorrect ? 1 : 0);

      await submitAnswer(
        sessionId,
        current.id,
        selected,
        isCorrect,
        responseTimeMs
      );

      setScore(newScore);
      setError("");

      if (index === QUESTIONS.length - 1) {
        await endSession(sessionId, newScore);

        localStorage.removeItem("sessionId");
        localStorage.removeItem("participantCode");
        localStorage.removeItem("group");
        localStorage.removeItem("audioCondition");

        setFinished(true);
        return;
      }

      setIndex(index + 1);
    } catch (err) {
      console.error("Failed to submit quiz answer:", err);
      setError("Could not save your answer. Check the console.");
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
          <h1 className="quiz-title">Done ✅</h1>
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
                "quiz-option" + (selected === i ? " quiz-option--selected" : "")
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
            ? "Saving..."
            : index === QUESTIONS.length - 1
              ? "Finish"
              : "Next"}
        </button>
      </div>
    </div>
  );
}

export default QuizSection;

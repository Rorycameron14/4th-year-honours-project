import React, { useEffect, useRef, useState } from "react";
import { submitAnswer, endSession } from "./graphql";
import "./QuizSection.css";

const QUESTIONS = [
  {
    id: "giza_q1",
    question: "What was the Great Pyramid built as?",
    options: ["A market", "A tomb for a pharaoh", "A school"],
    correctIndex: 1,
  },
  {
    id: "nile_q1",
    question: "Why was the River Nile important?",
    options: ["It provided water and helped farming", "It was made of gold", "It never flooded"],
    correctIndex: 0,
  },
  {
    id: "giza_q2",
    question: "What is the Sphinx?",
    options: ["A lion body with a human head", "A modern skyscraper", "A type of boat"],
    correctIndex: 0,
  },
];

function QuizSection() {
  const [sessionId, setSessionId] = useState("");
  const [participantCode, setParticipantCode] = useState("");
  const [group, setGroup] = useState("");
  const [audioCondition, setAudioCondition] = useState("");

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
  }, []);

  useEffect(() => {
    startedAtRef.current = Date.now();
    setSelected(null);
  }, [index]);

  const handleNext = async () => {
    if (!sessionId) {
      setError("No active session found. Please start the lesson first.");
      return;
    }

    if (selected === null) return;

    try {
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

      if (index === QUESTIONS.length - 1) {
        await endSession(sessionId, newScore);
        setFinished(true);
        return;
      }

      setIndex(index + 1);
      setError("");
    } catch (err) {
      console.error("Failed to submit quiz answer:", err);
      setError("Could not save your answer. Check the console.");
    }
  };

  if (!sessionId && !finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h1 className="quiz-title">Quiz</h1>
          <p className="quiz-subtitle">No active lesson session found.</p>
          <p className="quiz-meta">
            Start the lesson first, choose a sound condition, and then open the quiz.
          </p>
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
          <p className="quiz-meta">Participant: {participantCode || "Unknown"}</p>
          <p className="quiz-meta">Group: {group || "Unknown"}</p>
          <p className="quiz-meta">Audio: {audioCondition || "Unknown"}</p>
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
          Participant: {participantCode || "Unknown"} | Audio: {audioCondition || "Unknown"}
        </p>

        <h1 className="quiz-title">{current.question}</h1>

        <div className="quiz-options">
          {current.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={"quiz-option" + (selected === i ? " quiz-option--selected" : "")}
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
        >
          {index === QUESTIONS.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default QuizSection;
import React, { useEffect, useRef, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import "./QuizSection.css";

const START_SESSION = gql`
  mutation StartSession($participantCode: String!, $group: String!, $audioCondition: String!) {
    startSession(participantCode: $participantCode, group: $group, audioCondition: $audioCondition) {
      id
    }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($sessionId: ID!, $questionId: String!, $selectedIndex: Int!, $isCorrect: Boolean!, $responseTimeMs: Int!) {
    submitAnswer(sessionId: $sessionId, questionId: $questionId, selectedIndex: $selectedIndex, isCorrect: $isCorrect, responseTimeMs: $responseTimeMs) {
      id
    }
  }
`;

const END_SESSION = gql`
  mutation EndSession($sessionId: ID!, $score: Int!) {
    endSession(sessionId: $sessionId, score: $score) {
      id
      score
    }
  }
`;

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
  const [group, setGroup] = useState("ADHD");
  const [audioCondition, setAudioCondition] = useState("silence");

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startedAtRef = useRef(Date.now());

  const [startSession] = useMutation(START_SESSION);
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const [endSession] = useMutation(END_SESSION);

  const current = QUESTIONS[index];

  useEffect(() => {
    startedAtRef.current = Date.now();
    setSelected(null);
  }, [index]);

  const handleStart = async () => {
    if (!participantCode.trim()) return;

    const res = await startSession({
      variables: { participantCode, group, audioCondition },
    });

    const newId = res.data.startSession.id;
    setSessionId(newId);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const responseTimeMs = Date.now() - startedAtRef.current;
    const isCorrect = selected === current.correctIndex;

    await submitAnswer({
      variables: {
        sessionId,
        questionId: current.id,
        selectedIndex: selected,
        isCorrect,
        responseTimeMs,
      },
    });

    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    if (index === QUESTIONS.length - 1) {
      setFinished(true);
      await endSession({ variables: { sessionId, score: newScore } });
      return;
    }

    setIndex(index + 1);
  };

  if (!sessionId && !finished) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h1 className="quiz-title">Quiz</h1>
          <p className="quiz-subtitle">Enter a participant code to start logging results.</p>

          <div className="quiz-form">
            <input
              className="quiz-input"
              value={participantCode}
              onChange={(e) => setParticipantCode(e.target.value)}
              placeholder="Participant code (e.g. P01)"
            />

            <select className="quiz-input" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="ADHD">ADHD</option>
              <option value="Dyslexia">Dyslexia</option>
              <option value="Control">Control</option>
            </select>

            <select className="quiz-input" value={audioCondition} onChange={(e) => setAudioCondition(e.target.value)}>
              <option value="silence">Silence</option>
              <option value="white">White noise</option>
              <option value="ambient">Ambient</option>
            </select>

            <button className="quiz-primary" onClick={handleStart}>
              Start Quiz
            </button>
          </div>
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

        <h1 className="quiz-title">{current.question}</h1>

        <div className="quiz-options">
          {current.options.map((opt, i) => (
            <button
              key={i}
              className={"quiz-option" + (selected === i ? " quiz-option--selected" : "")}
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button className="quiz-primary" onClick={handleNext}>
          {index === QUESTIONS.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default QuizSection;
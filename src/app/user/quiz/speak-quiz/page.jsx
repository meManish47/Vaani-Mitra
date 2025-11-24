"use client";

import React, { useState } from "react";
import { quiz } from "../../../data/quiz/speakquizdata";
import { MdMic } from "react-icons/md";
import { startListening, stopListening } from "@/lib/listen"; // ← IMPORT YOUR FILE

const SpeakQuizPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [listening, setListening] = useState(false);

  const { questions } = quiz;
  const currentQuestion = questions[activeQuestion];

  if (!currentQuestion) return <p>Invalid question index</p>;

  const { question, correctAnswer: correctAns } = currentQuestion;

  // -------------------------
  // Recording Start / Stop
  // -------------------------
  const startRecording = () => {
    setListening(true);
    startListening((text) => setUserAnswer(text)); // ← updates textarea
  };

  const stopRecordingHandler = () => {
    stopListening();
    setListening(false);
    checkAnswer();
  };

  // -------------------------
  // Check Answer Logic
  // -------------------------
  const checkAnswer = () => {
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();

    setResult((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 5 : prev.score,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
    }));

    setCorrectAnswer(correctAns);
    setQuestionCompleted(true);

    if (activeQuestion === questions.length - 1) {
      setShowResult(true);
    }
  };

  // Go to next question
  const nextQuestion = () => {
    setActiveQuestion((prev) => prev + 1);
    setCorrectAnswer("");
    setUserAnswer("");
    setQuestionCompleted(false);
  };

  // -------------------------
  // UI Render
  // -------------------------
  return (
    <div className="container">
      {!showResult ? (
        <div>
          <h2>
            Question: {activeQuestion + 1}
            <span>/{questions.length}</span>
          </h2>

          <div className="quiz-container">
            <h3>{question}</h3>

            {questionCompleted && (
              <div
                className={`feedback ${
                  correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                    ? "correct"
                    : "wrong"
                }`}
              >
                {correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                  ? "Correct!"
                  : `Wrong! The correct answer is: ${correctAnswer}`}
              </div>
            )}

            <div className="answer-input">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Speak your answer..."
                disabled={listening}
              />

              <div className="action-buttons">
                <MdMic
                  className={`h-6 w-6 ${listening ? "recording" : ""}`}
                  onClick={listening ? stopRecordingHandler : startRecording}
                />
              </div>
            </div>

            <button
              onClick={nextQuestion}
              disabled={!questionCompleted}
              className={`btn ${!questionCompleted ? "btn-disabled" : ""}`}
            >
              {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          <h3>Results</h3>
          <h3>Overall {(result.score / (5 * questions.length)) * 100}%</h3>

          <p>
            Total Questions: <span>{questions.length}</span>
          </p>
          <p>
            Total Score: <span>{result.score}</span>
          </p>
          <p>
            Correct Answers: <span>{result.correctAnswers}</span>
          </p>
          <p>
            Wrong Answers: <span>{result.wrongAnswers}</span>
          </p>

          <button onClick={() => window.location.reload()}>Start +10XP</button>
          <button onClick={() => (window.location.href = "/user/leaderboard")}>
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeakQuizPage;

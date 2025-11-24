"use client";

import React, { useState } from "react";
import { quiz } from "../../../data/quiz/speakquizdata";
import { MdMic } from "react-icons/md";
import { Capacitor } from "@capacitor/core";

let webRecognition = null;

// -----------------------------
// Cross-platform Speech Recognition
// -----------------------------
async function startListening(onText) {
  const isNative = Capacitor.isNativePlatform();

  // -------------------------
  // Native (Android/iOS)
  // -------------------------
  if (isNative) {
    try {
      const { SpeechRecognition } = await import(
        "@capacitor-community/speech-recognition"
      );

      await SpeechRecognition.requestPermission();

      SpeechRecognition.start({
        language: "hi-IN",
        partialResults: true,
        maxResults: 1,
      });

      SpeechRecognition.addListener("speechResults", (data) => {
        if (data?.matches && data.matches.length > 0) {
          onText(data.matches[0]);
        }
      });
    } catch (e) {
      console.error("Native speech recognition error:", e);
    }
    return;
  }

  // -------------------------
  // Web Browser Fallback
  // -------------------------
  if (typeof window !== "undefined") {
    const Speech =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Speech) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    webRecognition = new Speech();
    webRecognition.continuous = true;
    webRecognition.interimResults = true;
    webRecognition.lang = "hi-IN";

    webRecognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onText(transcript);
    };

    webRecognition.start();
  }
}

function stopListening() {
  if (webRecognition) {
    webRecognition.stop();
  }

  // Native plugin auto-stops on its own
}

// -----------------------------
// MAIN QUIZ PAGE COMPONENT
// -----------------------------
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

  // -----------------------------
  // Recording handlers
  // -----------------------------
  const startRecording = () => {
    setListening(true);
    startListening((text) => setUserAnswer(text));
  };

  const stopRecordingHandler = () => {
    stopListening();
    setListening(false);
    checkAnswer();
  };

  // -----------------------------
  // Quiz Logic
  // -----------------------------
  const checkAnswer = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === correctAns.toLowerCase();

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

  const nextQuestion = () => {
    setActiveQuestion((prev) => prev + 1);
    setCorrectAnswer("");
    setUserAnswer("");
    setQuestionCompleted(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
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

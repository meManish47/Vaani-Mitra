"use client";

import React, { useState } from "react";
import { quiz } from "../../../data/quiz/speakquizdata";
import { MdMic } from "react-icons/md";
import { startListening, stopListening } from "@/lib/listen";
import Link from "next/link";

const SpeakQuizPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [listening, setListening] = useState(false);

  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  const currentQuestion = questions[activeQuestion];

  if (!currentQuestion) return <p>Invalid question index</p>;

  const { question, correctAnswer: correctAns } = currentQuestion;

  // -------------------------
  // Start / Stop Recording
  // -------------------------
  const startRecording = () => {
    setListening(true);
    startListening((text) => setUserAnswer(text));
  };

  const stopRecordingHandler = () => {
    stopListening();
    setListening(false);
    checkAnswer();
  };

  // -------------------------
  // Check Answer
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

  // -------------------------
  // Next Question
  // -------------------------
  const nextQuestion = () => {
    setActiveQuestion((prev) => prev + 1);
    setCorrectAnswer("");
    setUserAnswer("");
    setQuestionCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      {!showResult ? (
        <div>
          {/* Question Header */}
          <h2 className="text-2xl font-bold mb-4">
            Question {activeQuestion + 1}{" "}
            <span className="text-gray-500 text-lg">/ {questions.length}</span>
          </h2>

          {/* Question Box */}
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">{question}</h3>

            {/* Feedback Message */}
            {questionCompleted && (
              <div
                className={`mt-3 p-3 text-lg font-semibold rounded-lg ${
                  correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {correctAnswer.toLowerCase() === userAnswer.toLowerCase()
                  ? "Correct!"
                  : `Wrong! Correct Answer: ${correctAnswer}`}
              </div>
            )}

            {/* Answer Input && Mic Button */}
            <div className="mt-5">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Speak your answer..."
                disabled={listening}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              <div className="flex justify-center mt-4">
                <button
                  onClick={listening ? stopRecordingHandler : startRecording}
                  className={`p-4 rounded-full shadow-lg transition ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <MdMic className="h-8 w-8" />
                </button>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextQuestion}
              disabled={!questionCompleted}
              className={`mt-6 w-full py-3 text-lg font-bold rounded-lg transition ${
                questionCompleted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-300 text-white cursor-not-allowed"
              }`}
            >
              {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        /* ----------------------
            RESULTS SECTION
        ------------------------ */
        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h3 className="text-3xl font-bold mb-4">Results</h3>

          <p className="text-xl mb-2">
            Overall Score:{" "}
            <span className="font-bold">
              {Math.round((result.score / (questions.length * 5)) * 100)}%
            </span>
          </p>

          <p className="text-lg">
            Total Questions:{" "}
            <span className="font-semibold">{questions.length}</span>
          </p>

          <p className="text-lg">
            Total Score: <span className="font-semibold">{result.score}</span>
          </p>

          <p className="text-lg">
            Correct Answers:{" "}
            <span className="text-green-600 font-semibold">
              {result.correctAnswers}
            </span>
          </p>

          <p className="text-lg">
            Wrong Answers:{" "}
            <span className="text-red-600 font-semibold">
              {result.wrongAnswers}
            </span>
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-500 w-full py-3 text-white font-bold rounded-lg hover:bg-red-600"
          >
            Start +10XP
          </button>

          <button
            onClick={() => (window.location.href = "/user/leaderboard")}
            className="mt-4 bg-gray-700 w-full py-3 text-white font-bold rounded-lg hover:bg-gray-800"
          >
            View Leaderboard
          </button>
        </div>
      )}
      <Link href={"/"} className="text-red-500 underline mt-2">
        Home
      </Link>
    </div>
  );
};

export default SpeakQuizPage;

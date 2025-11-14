"use client";
import { useState } from "react";
import { MdVolumeUp } from "react-icons/md";
import { quiz } from "../../../data/quiz/listenquizdata";
import Link from "next/link";

const Page = () => {
  const [selectedAnswerForPronunciation, setSelectedAnswerForPronunciation] =
    useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [
    answerSelectedForCurrentQuestion,
    setAnswerSelectedForCurrentQuestion,
  ] = useState(false);

  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  const { answers, correctAnswer } = questions[activeQuestion];

  const pronounceText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    synth.speak(utterance);
  };

  const pronounceAnswer = (answer) => {
    pronounceText(answer);
    setSelectedAnswerForPronunciation(answer);
  };

  const onAnswerSelected = (answer, idx) => {
    if (!answerSelectedForCurrentQuestion) {
      setChecked(true);
      setSelectedAnswerIndex(idx);

      if (answer === correctAnswer) {
        setSelectedAnswer(true);
        pronounceText(answer);
      } else {
        setSelectedAnswer(false);
        pronounceText("Is prashna ka sahi uttar hai " + correctAnswer);
      }

      setAnswerSelectedForCurrentQuestion(true);
    }
  };

  const renderAnswerFeedback = () => {
    if (selectedAnswer === true) {
      return <div className="mt-2 font-bold text-green-600">Correct!</div>;
    }
    if (selectedAnswer === false) {
      return (
        <div className="mt-2 font-bold text-red-600">
          Wrong! Correct Answer:{" "}
          <span className="font-bold">{correctAnswer}</span>
        </div>
      );
    }
    return null;
  };

  const nextQuestion = () => {
    setAnswerSelectedForCurrentQuestion(false);
    setSelectedAnswerIndex(null);

    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }

    setChecked(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      {!showResult ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Question {activeQuestion + 1}
            <span className="text-gray-500 text-lg"> / {questions.length}</span>
          </h2>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">
              {questions[activeQuestion].question}
            </h3>

            {renderAnswerFeedback()}

            <ul className="mt-4 space-y-3">
              {answers.map((answer, idx) => (
                <li
                  key={idx}
                  onClick={() => onAnswerSelected(answer, idx)}
                  className={`cursor-pointer p-4 rounded-lg border transition 
                    ${
                      selectedAnswerIndex === idx
                        ? "bg-green-200 border-green-700"
                        : "bg-white border-gray-300 hover:border-green-600"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{answer}</span>
                    <MdVolumeUp
                      className="h-6 w-6 cursor-pointer text-gray-700 hover:text-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        pronounceAnswer(answer);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {checked ? (
              <button
                onClick={nextQuestion}
                className="mt-6 bg-red-500 text-white font-bold py-3 rounded-lg w-full hover:bg-red-600"
              >
                {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
              </button>
            ) : (
              <button
                disabled
                className="mt-6 bg-red-300 text-white font-bold py-3 rounded-lg w-full cursor-not-allowed"
              >
                {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
              </button>
            )}
          </div>
        </div>
      ) : (
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

export default Page;

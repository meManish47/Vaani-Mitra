"use client"
import React from "react";
import lettersData from "../data/letters/lettersData";
import { speak } from "@/lib/speak";
const LettersChart = () => {
  return (
    <section id="lettersChart">
      <h3 className="font-bold mb-4 text-xl">Letters Chart</h3>

      <div className="chart-container grid-cols-5">
        {lettersData.vowels.map((char, index) => (
          <div
            key={index}
            className={`chart-char-container ${
              char.character ? "chart-filled-container" : "chart-empty-container"
            }`}
            onClick={() => speak(char.character)}
          >
            {char.character}
            <span className="chart-pronunciation">{char.pronunciation}</span>
          </div>
        ))}
      </div>

      <hr className="chart-break" />

      <div className="chart-container grid-cols-5">
        {lettersData.consonants.map((char, index) => (
          <div
            key={index}
            className={`chart-char-container ${
              char.character ? "chart-filled-container" : "chart-empty-container"
            }`}
            onClick={() => speak(char.character)}
          >
            {char.character}
            <span className="chart-pronunciation">{char.pronunciation}</span>
          </div>
        ))}
      </div>

      <hr className="chart-break" />

      <div className="chart-container grid-cols-3">
        {lettersData.dependingVowels.map((char, index) => (
          <div
            key={index}
            className={`chart-char-container ${
              char.character ? "chart-filled-container" : "chart-empty-container"
            }`}
            onClick={() => speak(char.pronunciation)}
          >
            {char.character}
            <span className="chart-pronunciation">{char.pronunciation}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LettersChart;

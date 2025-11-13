"use client";
import React from "react";
import wordsData from "../data/words/wordsData";
import { speak } from "@/lib/speak";

const WordsChart = () => {

  return (
    <section id="wordsChart">
      <h3 className="font-bold mb-4 text-xl">Words Chart</h3>
      <hr className="chart-break" />
      <h4 className="font-bold mb-4 text-xl">Common Words:</h4>

      <div className="chart-container grid-cols-5">
        {wordsData.common.map((char, index) => (
          <div
            key={`id-${index}`}
            className={`chart-char-container ${
              char.word ? "chart-filled-container" : "chart-empty-container"
            }`}
            onClick={() => speak(char.word)}   // <-- Android + Web TTS
          >
            {char.word}
            <span className="chart-pronunciation">{char.pronunciation}</span>
          </div>
        ))}
      </div>

      <hr className="chart-break" />
    </section>
  );
};

export default WordsChart;

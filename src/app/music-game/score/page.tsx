"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMatch } from "@/contexts/MatchContext";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { Page } from "@/components/Page";
import Link from "next/link";

const GameRound = () => {
  const [state, dispatch] = useMatch();
  const [, setStoredLog] = useLocalStorage("storedLog", []);

  const storeAndReset = () => {
    setStoredLog(state.log);
    dispatch({ type: "INITIAL" });
  };

  let points = 0;
  let timesCorrect = 0;

  if (state.log) {
    state.log.forEach((log) => {
      if (log.correct) {
        points += log.points;
        timesCorrect++;
      }
    });
  }

  return (
    <Page>
      <div className="bg-sky-500 text-gray-800 min-h-screen p-4 w-full  flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Your score is {points} Points!
        </h1>
        <div className="bg-slate-100 flex flex-col items-center justify-center text-center text-lg rounded-lg py-4 px-6 mt-4">
          <p>
            You got {timesCorrect}/{state.guesses} right!
          </p>
          {state.roundList.map((round, i) => (
            <div>
              <p>Round {i + 1}</p>
              {round.songChoices.map((song, j) => (
                <div>
                  <p>
                    {song.title_short} by {song.artist.name}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link href="/music-game">
          <button
            onClick={storeAndReset}
            className="bg-slate-100 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
          >
            Back to the start!
          </button>
        </Link>
      </div>
    </Page>
  );
};

export default GameRound;

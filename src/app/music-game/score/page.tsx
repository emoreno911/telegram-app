"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMatch } from "@/contexts/MatchContext";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { Page } from "@/components/Page";

const GameRound = () => {
  const [state, dispatch] = useMatch();
  const [, setStoredLog] = useLocalStorage("storedLog", []);

  const storeAndReset = () => {
    setStoredLog(state.log);
    dispatch({ type: "INITIAL" });
  };

  let points = 0;
  let timesCorrect = 0;
  console.log({ state });
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
      <div className="bg-sky-500 text-gray-800 min-h-screen p-4 w-full flex justify-center">
        <h1>{points}</h1>
        <p>
          {timesCorrect}/{state.guesses}
        </p>
      </div>
    </Page>
  );
};

export default GameRound;

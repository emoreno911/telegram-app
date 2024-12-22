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
    const cleanLog = (roundList) => {
      let newLog = roundList.map((oldRound) => {
        const { round, guessed, time, points, correctSong, songChoices } =
          oldRound;

        return {
          round,
          guessed,
          time,
          points,
          id: songChoices[correctSong].id,
          song: songChoices[correctSong].title,
          artist: songChoices[correctSong].artist.name,
          album: songChoices[correctSong].album.title,
        };
      });
      return newLog;
    };

    setStoredLog(cleanLog(state.roundList));
    dispatch({ type: "INITIAL" });
  };

  let points = 0;
  let timesCorrect = 0;

  if (state.roundList) {
    state.roundList.forEach((round) => {
      if (round.guessed) {
        points += round.points;
        timesCorrect++;
      }
    });
  }

  return (
    <Page>
      <div className="bg-sky-500 text-gray-800 min-h-screen p-4 w-full  flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Let's see how you did
        </h1>
        <div className="bg-slate-100 flex flex-col items-center justify-center text-center text-lg rounded-lg py-4 px-6 mt-4">
          {state.roundList.map((round, i) => (
            <div className="bg-slate-300 rounded-lg py-4 px-6 mb-2">
              <p>
                In round {i + 1} you got it {round.guessed ? "right!" : "wrong"}
              </p>
              <div className="flex">
                {round.songChoices.map((song, j) => (
                  <p className="mr-2">
                    {song.title_short} by {song.artist.name}
                    {!(j === round.songChoices.length - 1) && " VS "}
                  </p>
                ))}
              </div>
              {round.guessed && (
                <p>
                  {" "}
                  you guessed in {round.time} seconds, giving you {round.points}{" "}
                  points!
                </p>
              )}
            </div>
          ))}
          <p>
            You got {timesCorrect}/{state.guesses} right!
          </p>
          <p className="">Giving you {points} Points!</p>
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

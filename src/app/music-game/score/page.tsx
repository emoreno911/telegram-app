"use client";
import React, { useCallback, useEffect, useState } from "react";
import { roundType, useMatch } from "@/contexts/MatchContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Page } from "@/components/Page";
import Link from "next/link";
import GameContainer from "@/components/Common/GameContainer";
import ScrollableContainer from "@/components/Common/ScrollableContainer";
import { useDapp } from "@/contexts/DappContext";
import { IconAlertTriangle, IconAlertTriangleFilled } from "@tabler/icons-react";

const GameRound = () => {
  const { profileToken, updatePlayerStats } = useDapp();
  const [state, dispatch] = useMatch();
  const [, setStoredLog] = useLocalStorage("storedLog", []);

  const storeAndReset = () => {
    const cleanLog = (roundList: roundType[]) => {
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

      const result = newLog.reduce((acc, current) => {
        return {
          totalPoints: acc.totalPoints + current.points,
          totalTime: acc.totalTime + current.time
        };
      }, { totalPoints: 0, totalTime: 0 });

      const sumArray = [result.totalPoints, result.totalTime/5];

      updatePlayerStats(JSON.stringify({
        totals: sumArray, 
        cat_name: state.category.title,
        cat_id: state.category.id
      }))

      return newLog
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
      <GameContainer>
        <ScrollableContainer>
        <div className="z-10">
        <h2 className="text-3xl font-bold text-sky-500 text-shadow-black text-center mt-2">
          {"Let's see how you did it"}
        </h2>
        <div className="bg-transparent flex flex-col items-center justify-center text-center text-lg rounded-lg py-4 px-2 md:px-6">
          {state.roundList.map((round, i) => (
            <div
              key={i}
              className={`${
                round.guessed ? "bg-teal-600" : "bg-rose-600"
              } rounded-lg py-4 px-6 mb-2 w-full`}
            >
              <p className="text-lg font-semibold">
                Round #{i + 1}: you got it {round.guessed ? "right!" : "wrong"}
              </p>
              {/* <div className="flex flex-col">
                {round.songChoices.map((song, j) => (
                  <div key={j}>
                    <p className="font-bold">
                      {song.title_short} by {song.artist.name}
                    </p>
                    <p>{!(j === round.songChoices.length - 1) && " VS "}</p>
                  </div>
                ))}
              </div> */}
              {round.guessed && (
                <p className="text-sm">
                  You guessed in {Math.floor(round.time)} seconds, giving you{" "}
                  {round.points} points!
                </p>
              )}
            </div>
          ))}
          <div className="bg-gray-100 px-6 py-4 rounded-md text-gray-800 w-full">
            <p className="font-semibold">
              You got {timesCorrect}/{state.guesses} right!
            </p>
            <p className="">Giving you a total of {points} Points!</p>
          </div>
        </div>
        {profileToken === null && (
          <div className="pt-4 text-center text-lg text-orange-400">
            <p> <IconAlertTriangleFilled className="h-5 w-5 inline mr-1" /> <span>It seems your wallet isn't connected yet!</span></p>
            <p>Please connect wallet to store your scores</p>
          </div>
        )}
        <div className="flex justify-center gap-2">
          {profileToken !== null && (
            <Link href="/music-game">
              <button
                onClick={storeAndReset}
                className="mx-auto bg-slate-100 text-gray-800 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
              >
                Play again!
              </button>
            </Link>
          )}
          <Link href="/">
            <button
              onClick={storeAndReset}
              className="mx-auto bg-slate-100 text-gray-800 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
            >
              Back to Home
            </button>
          </Link>
        </div>
        </div>
        </ScrollableContainer>
      </GameContainer>
    </Page>
  );
};

export default GameRound;

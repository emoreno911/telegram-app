import { useMatch } from "@/contexts/MatchContext";
import { songType } from "@/types/deezerApiTypes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type propTypes = {
  genre: string;
  songChoices: songType[];
  correctSong: number;
  currentRound: number;
  round: number;
  setCurrentRound: (newCurrent: number) => null;
};

export default function Round({
  genre,
  songChoices,
  correctSong,
  currentRound,
  round,
  setCurrentRound,
}: propTypes) {
  const [state, dispatch] = useMatch();

  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [guessed, setGuessed] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const audioFile = useRef<any>(null);
  const start = useRef<any>(null);
  const isArtist = useRef<boolean>(false);

  const timeUpdateHandler = () => {
    let newProgress = audioFile?.current?.currentTime / state.timeToGuess;
    setProgress(Math.floor(newProgress * 100));
  };

  const canPlayThroughHandler = () => {
    /* the audio is now playable; play it if permissions allow */
    if (currentRound === round) {
      setIsLoading(false);
      audioFile.current.play();
      setTimeout(() => {
        if (!guessed) {
          handleOnClick("timeout");
        } else if (audioFile.current) {
          audioFile.current.pause();
        }
      }, state.timeToGuess * 1000);
      start.current = Date.now();
    }
  };

  const resetAudio = useCallback(() => {
    if (audioFile.current) {
      audioFile.current.pause();
      audioFile.current.removeEventListener("timeupdate", timeUpdateHandler);
      audioFile.current.removeEventListener(
        "canplaythrough",
        canPlayThroughHandler
      );
      audioFile.current = null;
    }
  }, [audioFile.current]);

  const handleOnClick = (id: string) => {
    audioFile.current.pause();
    const time = Math.floor(Date.now() - start.current) / 1000;
    const newLog = {
      id: songChoices[correctSong].id,
      correct: songChoices[correctSong].id === id,
      song: songChoices[correctSong].title,
      artist: songChoices[correctSong].artist.name,
      album: songChoices[correctSong].album.title,
      time,
      points: Math.floor(state.timeToGuess - time),
    };
    setIsCorrect(id === songChoices[correctSong].id);
    dispatch({
      type: "SET_LOG",
      newLog,
    });
    setGuessed(true);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
  };

  useEffect(() => {
    isArtist.current = Math.floor(Math.random() * 2) === 1;
    // Should validate if all the choices have the same artist
    audioFile.current = new Audio(songChoices[correctSong].preview);
    audioFile.current.addEventListener("timeupdate", timeUpdateHandler);
    audioFile.current.addEventListener("canplaythrough", canPlayThroughHandler);
    return () => {
      resetAudio();
    };
  }, []);
  useEffect(() => {
    canPlayThroughHandler();
  }, [currentRound]);

  return (
    <>
      {currentRound === round && (
        <>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center">{`${genre} #${
                round + 1
              }`}</h1>
              <h1 className="text-xl font-bold mb-6 text-center">
                Guess the {isArtist.current ? "Artist" : "Song"}
              </h1>
              <ul
                className={`font-[family-name:var(--font-geist-mono)] grid grid-cols-${state.songsPerGuess} text-2xl mx-2`}
              >
                {songChoices.length > 0 &&
                  songChoices.map((song) => (
                    <li
                      key={song.id}
                      className={`${
                        guessed
                          ? song.id === songChoices[correctSong].id
                            ? "bg-green-400"
                            : "bg-red-400"
                          : "bg-white"
                      } rounded-lg p-4 mx-2 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer min-w-40 max-w-96`}
                      onClick={() => handleOnClick(song.id)}
                    >
                      <span className="text-lg font-bold text-gray-700">
                        {isArtist.current ? song.artist.name : song.title}
                      </span>
                    </li>
                  ))}
              </ul>

              <div className="px-4 my-4">
                <div className="bg-slate-100 w-full h-4 rounded-lg">
                  <div
                    className="bg-blue-500 h-full rounded-lg"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {guessed && (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-bold">
                    {isCorrect
                      ? "You got it!"
                      : "Better luck on the next time!"}
                  </p>
                  {state.roundList.length - 1 === round ? (
                    <Link href="/music-game/score">
                      <button className="bg-slate-100 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4">
                        See Results
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="bg-slate-100 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
                      onClick={nextRound}
                    >
                      Next Round
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

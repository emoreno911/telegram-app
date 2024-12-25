import { useMatch } from "@/contexts/MatchContext";
import { songType } from "@/types/deezerApiTypes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../app/_assets/logos/deezer_logo.png";
import Image from "next/image";
import { IconMusic, IconVinyl } from "@tabler/icons-react";
import ProgressBar from "../Common/ProgressBar";
import CanvasProgressBar from "../Common/CanvasProgressBar";

type propTypes = {
  genre: string;
  songChoices: songType[];
  correctSong: number;
  currentRound: number;
  round: number;
  setCurrentRound: (newCurrent: number) => null;
};

type guessStateTypes = "" | "NO_GUESS" | "CORRECT" | "INCORRECT";

let clock: ReturnType<typeof setTimeout>;

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
  const [guess, setguess] = useState<number>(0);
  const [guessState, setGuessState] = useState<guessStateTypes>("NO_GUESS");

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
      clock = setTimeout(() => {
        if (guessState && guessState === "NO_GUESS") {
          handleOnClick(0);
        } else if (audioFile.current) {
          audioFile.current.pause();
        }
      }, (state.timeToGuess + 0.2) * 1000);
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

  const handleOnClick = (id: number) => {
    clearTimeout(clock);
    audioFile.current.pause();
    setguess(id);
    const time = (Date.now() - start.current) / 1000;

    const guessed = id === songChoices[correctSong].id;

    dispatch({
      type: "UPDATE_ROUND",
      updatedRound: {
        songChoices,
        correctSong,
        round,
        guessed,
        time,
        points: guessed ? Math.round(state.timeToGuess - time * 0.75) : 0,
      },
    });
    setGuessState(guessed ? "CORRECT" : "INCORRECT");
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
  };

  useEffect(() => {
    setGuessState("NO_GUESS");
    isArtist.current = Math.floor(Math.random() * 2) === 1;
    if (
      isArtist.current &&
      songChoices.length === 2 &&
      songChoices[0].artist.name === songChoices[1].artist.name
    ) {
      isArtist.current = false;
    }
    // Should validate if all the choices have the same artist
    audioFile.current = new Audio(songChoices[correctSong].preview);
    audioFile.current.addEventListener("timeupdate", timeUpdateHandler);
    audioFile.current.addEventListener("canplaythrough", canPlayThroughHandler);
    //audioFile.current.crossOrigin = "anonymous";
    
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
              <h1 className="text-3xl font-bold mb-6 text-sky-500 text-shadow-black text-center">{`${decodeURIComponent(genre)}`}</h1>
              <div className="bg-gray-200 w-full h-36 md:h-48 rounded-md mb-6 p-2">
              {guessState !== "NO_GUESS" ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-pink-300 p-1 rounded-md h-32 w-32 md:h-44 md:w-44">
                    <img
                      className="w-full h-full rounded-md"
                      src={songChoices[correctSong].album.cover}
                      alt="Music Cover"
                    />
                  </div>
                  <div className="flex-grow text-gray-800 space-y-1 md:space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500 font-semibold">Round #{round + 1}</span>
                      
                    </div>
                    
                    <h3 className="text-md md:text-lg font-bold mb-2">
                      {songChoices[correctSong].title_short} by <span className="text-sky-700">{songChoices[correctSong].artist.name}</span>
                    </h3>
                    <div className="bg-white w-full h-1 rounded-lg">
                      <div
                        className="bg-pink-500 h-full rounded-lg"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div>
                      <Link
                        href={songChoices[correctSong].link}
                        passHref={true}
                        target="_blank"
                        className="!inline-block"
                      >
                        <div className="border border-slate-800 flex items-center gap-1 text-sm rounded-md mt-2 px-2">
                          <span className="font-bold">Listen on</span>
                          <Image
                            className="h-4 w-16"
                            src={logo}
                            alt="Deezer Logo"
                          />
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>
              ): (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-pink-300 rounded-md h-32 w-32 md:h-44 md:w-44">
                    {isArtist.current ? (
                      <IconVinyl className="w-12 h-12 text-pink-500"/>
                    ): (
                      <IconMusic className="w-12 h-12 text-pink-500"/>
                    )}
                  </div>
                  <div className="flex-grow text-gray-800">
                    <span className="text-pink-500 font-semibold">Round #{round + 1}</span>
                    <h3 className="text-xl font-bold mb-2">
                      Guess the {isArtist.current ? "Artist" : "Song"}...
                    </h3>
                    {/* <div className="bg-white w-full h-3 rounded-lg">
                      <div
                        className="bg-pink-500 h-full rounded-lg"
                        style={{ width: `${progress}%` }}
                      />
                    </div> */}
                    <CanvasProgressBar progress={progress} />
                  </div>
                </div>
              )}
              </div>

              {guessState !== "NO_GUESS" && (
                <div className="mb-4 text-center">
                  <span className={`block text-white font-semibold rounded-md px-2 ${guessState === "CORRECT" ? "bg-teal-600" : "bg-rose-600"}`}>
                    {guessState === "CORRECT"
                      ? "You got it!"
                      : "Better luck next time!"}
                  </span>
                </div>
              )}

              <div
                className={`font-[family-name:var(--font-geist-mono)] grid grid-cols-1 md:grid-cols-2 gap-2 text-2xl w-fit mx-auto`}
              >
                {songChoices.length > 0 &&
                  songChoices.map((song) => (
                    <button
                      key={song.id}
                      className={`${
                        guessState !== "NO_GUESS" && guess === song.id
                          ? guessState === "CORRECT"
                            ? "bg-teal-400"
                            : "bg-rose-400"
                          : "bg-white"
                      } min-w-80 md:min-w-32 rounded-lg p-4 mx-2 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer min-w-40 max-w-96`}
                      onClick={() => handleOnClick(song.id)}
                      disabled={guessState !== "NO_GUESS"}
                    >
                      <span className="text-lg font-bold text-gray-700">
                        {isArtist.current ? song.artist.name : song.title_short}
                      </span>
                    </button>
                  ))}
              </div>

              {guessState !== "NO_GUESS" && (
                <div className="flex flex-col items-center text-gray-800">
                  <>
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
                  </>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

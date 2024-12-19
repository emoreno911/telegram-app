import { useMatch } from "@/contexts/MatchContext";
import { songType } from "@/types/deezerApiTypes";
import { useCallback, useEffect, useRef, useState } from "react";

type propTypes = {
  songChoices: songType[];
  correctSong: number;
  currentRound: number;
  round: number;
  setCurrentRound: (newCurrent: number) => null;
};

export default function Round({
  songChoices,
  correctSong,
  currentRound,
  round,
  setCurrentRound,
}: propTypes) {
  const [state, dispatch] = useMatch();

  const [progress, setProgress] = useState<number>(0);

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
      audioFile.current.play();
      setTimeout(() => {
        if (audioFile.current) {
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
      correct: id === songChoices[correctSong].id,
      song: songChoices[correctSong].title,
      artist: songChoices[correctSong].artist.name,
      album: songChoices[correctSong].album.title,
      time,
      points: Math.floor(state.timeToGuess - time),
    };
    dispatch({
      type: "SET_LOG",
      newLog,
    });
    setCurrentRound(currentRound + 1);
  };

  useEffect(() => {
    isArtist.current = Math.floor(Math.random() * 2) === 1;
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
          <h1 className="text-xl font-bold mb-6 text-center">
            Guess the {isArtist.current ? "Artist" : "Song"}
          </h1>
          <ul className="font-[family-name:var(--font-geist-mono)] min-w-[500px] grid grid-cols-2 text-2xl mx-2">
            {state?.roundList[currentRound]?.songChoices?.length > 0 &&
              state.roundList[currentRound].songChoices.map((song) => (
                <li
                  key={song.id}
                  className="bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => handleOnClick(song.id)}
                >
                  <span className="text-sm font-medium text-gray-700">
                    {isArtist.current ? song.artist.name : song.title}
                  </span>
                </li>
              ))}
          </ul>
          <div className="bg-blue-50 w-full h-4 rounded-lg my-4">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </>
  );
}

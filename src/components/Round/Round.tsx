import { useMatch } from "@/contexts/MatchContext";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Round() {
  const [state, dispatch] = useMatch();

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const audioFile = useRef<any>(null);
  const start = useRef<any>(null);
  const number = useRef<number>(0);
  const isArtist = useRef<boolean>(false);

  const timeUpdateHandler = () => {
    let newProgress = audioFile?.current?.currentTime / state.timeToGuess;
    setProgress(Math.floor(newProgress * 100));
  };

  const canPlayThroughHandler = () => {
    /* the audio is now playable; play it if permissions allow */
    audioFile.current.play();
    setTimeout(() => {
      if (audioFile.current) {
        audioFile.current.pause();
      }
    }, state.timeToGuess * 1000);
    start.current = Date.now();
  };

  const setupComponent = useCallback(() => {
    if (currentRound < state.guesses) {
      isArtist.current = Math.floor(Math.random() * 2) === 1;
      audioFile.current = new Audio(
        state.roundList[currentRound].songChoices[
          state.roundList[currentRound].correctSong
        ].preview
      );
      audioFile.current.addEventListener("timeupdate", timeUpdateHandler);
      audioFile.current.addEventListener(
        "canplaythrough",
        canPlayThroughHandler
      );
    }
    state.roundList;
  }, [state]);

  const resetAudio = useCallback(() => {
    if (audioFile.current) {
      audioFile.current.removeEventListener("timeupdate", timeUpdateHandler);
      audioFile.current.removeEventListener(
        "canplaythrough",
        canPlayThroughHandler
      );
      audioFile.current.pause();
      audioFile.current = null;
    }
  }, [audioFile.current]);

  const resetComponent = useCallback(() => {
    setCurrentRound(currentRound + 1);
    setProgress(0);
    resetAudio();

    start.current = null;
    number.current = 0;
    isArtist.current = false;

    setupComponent();
  }, [audioFile.current]);

  const handleOnClick = (id: string) => {
    audioFile.current.pause();
    const time = Math.floor(Date.now() - start.current) / 1000;
    const newLog = {
      id: state.roundList[currentRound].songChoices[
        state.roundList[currentRound].correctSong
      ].id,
      correct:
        id ===
        state.roundList[currentRound].songChoices[
          state.roundList[currentRound].correctSong
        ].id,
      song: state.roundList[currentRound].songChoices[
        state.roundList[currentRound].correctSong
      ].title,
      artist:
        state.roundList[currentRound].songChoices[
          state.roundList[currentRound].correctSong
        ].artist.name,
      album:
        state.roundList[currentRound].songChoices[
          state.roundList[currentRound].correctSong
        ].album.title,
      time,
      points: Math.floor(state.timeToGuess - time),
    };
    dispatch({
      type: "SET_LOG",
      newLog,
    });
    setTimeout(resetComponent, 0);
  };

  useEffect(() => {
    setupComponent();
    return () => {
      resetAudio();
    };
  }, []);

  return (
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
        <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}

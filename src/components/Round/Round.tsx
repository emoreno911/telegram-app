import { useMatch } from "@/contexts/MatchContext";
import { songType } from "@/types/deezerApiTypes";
import { useEffect, useRef, useState } from "react";

export default function Round() {
  const [state, dispatch] = useMatch();

  const [songList, setSongList] = useState<songType[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const audioFile = useRef<any>(null);
  const number = useRef<any>(null);
  const start = useRef<any>(null);
  const guess = useRef<any>(null);

  useEffect(() => {
    if (state.currentRound < state.numberOfGuesses) {
      let tempSongs = [...state?.songList];
      const newSongList = [tempSongs.pop(), tempSongs.pop()];
      setSongList(newSongList);

      guess.current = Math.floor(Math.random() * 2);
      number.current = Math.floor(Math.random() * state.numberOfSongs);
      console.log({ number: number.current, newSongList });
      audioFile.current = new Audio(newSongList[number.current].preview);
      audioFile.current.addEventListener("timeupdate", () => {
        let newProgress =
          audioFile?.current?.currentTime / audioFile?.current?.duration;
        setProgress(Math.floor(newProgress * 100));
      });
      audioFile.current.addEventListener("canplaythrough", () => {
        /* the audio is now playable; play it if permissions allow */
        audioFile.current.play();
        start.current = Date.now();
      });
    }
    return () => {
      audioFile.current.pause();
      audioFile.current = null;
    };
  }, []);

  const handleOnClick = (id: string) => {
    audioFile.current.pause();
    const time = Math.floor(Date.now() - start.current) / 1000;
    dispatch({
      type: "SET_LOG",
      newLog: {
        correct: id === songList[number.current].id,
        song: songList[number.current].title,
        artist: songList[number.current].artist.name,
        album: songList[number.current].album.title,
        time,
        points: state.timeToGuess - time,
      },
    });
    dispatch({ type: "NEXT_ROUND" });
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6 text-center">
        Guess the {guess.current === 1 ? "Song" : "Artist"}
      </h1>
      <ul className="font-[family-name:var(--font-geist-mono)] min-w-[500px] grid grid-cols-2 text-2xl mx-2">
        {songList.map((song) => (
          <li
            key={song.id}
            className="bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => handleOnClick(song.id)}
          >
            <span className="text-sm font-medium text-gray-700">
              {guess.current === 1 ? song.title : song.artist.name}
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

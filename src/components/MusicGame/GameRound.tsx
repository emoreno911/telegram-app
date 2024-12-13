import React, { useEffect } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";
import { getApiRadio, getSongs } from "@/app/helpers/functions";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state, dispatch] = useMatch();

  useEffect(() => {
    (async () => {
      const { data: newCategory } = await getApiRadio({ title: genre });
      dispatch({ type: "SET_CATEGORY", category: newCategory });
      const { data } = await getSongs(
        newCategory,
        state?.numberOfSongs * state?.numberOfGuesses
      );
      dispatch({
        type: "SET_SONGS",
        songList: data?.sort(() => 0.5 - Math.random()),
      });
    })();
    // (async () => {
    //   const { data } = await getSongs(
    //     newCategory,
    //     state?.numberOfSongs * state?.numberOfGuesses
    //   );
    //   dispatch({
    //     type: "SET_SONGS",
    //     songList: data?.sort(() => 0.5 - Math.random()),
    //   });
    // })();
  }, []);

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {genre} Round #{state.currentRound + 1}
      </h1>
      <Round />
    </div>
  );
};

export default GameRound;

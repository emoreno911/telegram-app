import React, { useCallback, useEffect } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state] = useMatch();

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{genre}</h1>
      {state.roundList?.length > 0 && <Round />}
    </div>
  );
};

export default GameRound;

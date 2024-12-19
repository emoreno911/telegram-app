import React, { useCallback, useEffect, useState } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state] = useMatch();
  const [currentRound, setCurrentRound] = useState<number>(0);

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{genre}</h1>
      {state.roundList?.length > 0 &&
        state.roundList.map((round) => (
          <Round
            {...round}
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
          />
        ))}
    </div>
  );
};

export default GameRound;

import React, { useState } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state] = useMatch();
  const [currentRound, setCurrentRound] = useState<number>(0);

  return (
    <div className="bg-sky-500 text-gray-800 min-h-screen p-4 w-full flex justify-center">
      {state.roundList?.length > 0 &&
        state.roundList.map((round) => (
          <Round
            key={round.round}
            genre={genre}
            {...round}
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
          />
        ))}
    </div>
  );
};

export default GameRound;

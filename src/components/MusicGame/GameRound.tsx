import React, { useState } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";
import ScrollableContainer from "../Common/ScrollableContainer";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state] = useMatch();
  const [currentRound, setCurrentRound] = useState<number>(0);

  return (
    <ScrollableContainer>
      <div className="z-10 text-gray-100">
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
    </ScrollableContainer>
  );
};

export default GameRound;

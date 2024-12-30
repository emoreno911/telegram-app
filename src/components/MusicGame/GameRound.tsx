import React, { useState } from "react";
import Round from "../Round/Round";
import { useMatch } from "@/contexts/MatchContext";
import ScrollableContainer from "../Common/ScrollableContainer";
import Link from "next/link";

interface Props {
  genre: string;
}

const GameRound: React.FC<Props> = ({ genre }) => {
  const [state] = useMatch();
  const [currentRound, setCurrentRound] = useState<number>(0);

  return (
    <ScrollableContainer>
      <div className="z-10 text-gray-100">
        {state.roundList?.length > 0 ?
          state.roundList.map((round) => (
            <Round
              key={round.round}
              genre={genre}
              {...round}
              currentRound={currentRound}
              setCurrentRound={setCurrentRound}
            />
          )) :
          (<div>
            <p className="text-3xl font-bold text-sky-500 text-shadow-black text-center mt-2">This playlist is temporarily unnavailable</p>
            <Link href="/music-game">
              <button
                className="mx-auto bg-slate-100 text-gray-800 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
              >
                Back to the start!
              </button>
            </Link>
          </div>)
        }
      </div>
    </ScrollableContainer>
  );
};

export default GameRound;

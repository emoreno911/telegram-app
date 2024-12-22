"use client";
import { categoryType, songType } from "@/types/deezerApiTypes";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

const initialMatchState: matchStateType = {
  timeToGuess: 15,
  guesses: 5,
  songsPerGuess: 2,
  step: 1,
  category: "",
  roundList: [],
};

const matchReducer = (state: matchStateType, payload: payloadType) => {
  switch (payload.type) {
    case "INITIAL": {
      return { ...initialMatchState };
    }
    case "SET_CATEGORY": {
      return { ...state, category: payload.category, step: 2 };
    }
    case "NEXT_STEP": {
      return { ...state, step: state.step + 1 };
    }
    case "SET_ROUNDS": {
      let songs = [...payload.songList];
      if (!songs || songs.length === 0) {
        return {
          ...state,
        };
      }

      let roundList: roundType[] = [];
      for (let i = 0; i < state.guesses; i++) {
        roundList.push({
          songChoices: [],
          correctSong: 0,
          round: i,
          guessed: false,
          time: 0,
          points: 0,
        });
      }

      roundList.forEach((round) => {
        //.sort(() => 0.5 - Math.random())
        for (let i = 0; i < state.songsPerGuess; i++) {
          round.songChoices.push(songs.pop());
        }
        round.correctSong = Math.floor(
          Math.random() * round.songChoices.length
        );
      });

      return {
        ...state,
        roundList,
      };
    }
    case "UPDATE_ROUND": {
      const newRoundList = [...state.roundList];
      const index = newRoundList.findIndex(
        (possibleRound) => possibleRound.round === payload.updatedRound.round
      );

      if (index !== -1) {
        newRoundList[index] = {
          ...newRoundList[index],
          ...payload.updatedRound,
        };
        return {
          ...state,
          roundList: newRoundList,
        };
      } else {
        return state;
      }
    }
    default:
      throw new Error(`Unhandled action type: ${payload.type}`);
  }
};

const MatchContext = createContext<
  [state: matchStateType, dispatch: Dispatch<payloadType>]
>([initialMatchState, () => null]);

export function MatchProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer<Dispatch<payloadType>>(
    matchReducer,
    initialMatchState
  );

  return (
    <MatchContext.Provider value={[state, dispatch]}>
      {children}
    </MatchContext.Provider>
  );
}

export const useMatch = () => useContext(MatchContext);

export type roundType = {
  songChoices: songType[];
  correctSong: number;
  round: number;
  guessed: boolean;
  time: number;
  points: number;
};

export type matchStateType = {
  timeToGuess: number;
  guesses: number;
  songsPerGuess: number;
  step: number;
  category: string;
  roundList: roundType[];
};

type payloadType =
  | { type: "INITIAL" }
  | { type: "SET_CATEGORY"; category: categoryType }
  | { type: "NEXT_STEP" }
  | { type: "SET_ROUNDS"; songList: songType[] }
  | { type: "UPDATE_ROUND"; updatedRound: roundType };

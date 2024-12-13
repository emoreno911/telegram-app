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
  currentRound: 0,
  timeToGuess: 30,
  numberOfGuesses: 5,
  numberOfSongs: 2,
  step: 1,
  category: "",
  songList: [],
  log: [],
};

const matchReducer = (state: matchStateType, payload: payloadType) => {
  switch (payload.type) {
    case "INITIAL": {
      return { ...payload.state };
    }
    case "SET_CATEGORY": {
      return { ...state, category: payload.category, step: 2 };
    }
    case "NEXT_STEP": {
      return { ...state, step: state.step + 1 };
    }
    case "SET_SONGS": {
      return {
        ...state,
        songList: payload.songList,
        step: state.step + 1,
      };
    }
    case "SET_LOG": {
      return { ...state, log: [...state.log, payload.newLog] };
    }
    case "NEXT_ROUND": {
      return { ...state, currentRound: state.currentRound + 1 };
    }
    default: {
      throw Error("Unknown action");
    }
  }
};

const MatchContext = createContext<matchType>([initialMatchState, () => null]);

export function MatchProvider({ children }: PropsWithChildren) {
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

type matchStateType = {
  currentRound: number;
  timeToGuess: number;
  numberOfGuesses: number;
  numberOfSongs: number;
  step: number;
  category: string;
  songList: songType[];
  log: any[];
};

type matchType = [matchStateType, Dispatch<payloadType>];

type payloadType =
  | { type: "INITIAL"; state: matchStateType }
  | { type: "SET_CATEGORY"; category: categoryType }
  | { type: "NEXT_STEP" }
  | { type: "SET_SONGS"; songList: songType[] }
  | { type: "NEXT_ROUND" }
  | { type: "SET_LOG"; newLog: any };

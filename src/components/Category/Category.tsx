"use client";
import { useCallback } from "react";
import { useMatch } from "@/contexts/MatchContext";
import { getSongs } from "../../app/helpers/functions";
import { categoryType } from "@/types/deezerApiTypes";
import { useRouter } from "next/navigation";
import GameButton from "../Common/GameButton";

export default function Category(category: categoryType) {
  const router = useRouter();
  const [state, dispatch] = useMatch();

  const handleOnCategoryClick = useCallback(
    async (newCategory: categoryType) => {
      if (newCategory) {
        dispatch({ type: "SET_CATEGORY", category: newCategory });

        const { data: songList } = await getSongs(
          newCategory,
          state?.songsPerGuess * state?.guesses
        );

        const payload = {
          type: "SET_ROUNDS",
          songList: songList || [],
        };
        dispatch(payload);
        router.push(`/music-game/round/${category.title}`);
      }
    },
    [category]
  );

  // return (
  //   <div
  //     className="cursor-pointer"
  //     onClick={() => {
  //       handleOnCategoryClick(category);
  //     }}
  //   >
  //     {/* <category.icon className="w-12 h-12 mb-2 text-indigo-600" /> */}
  //     <span className="text-sm font-medium text-gray-700">
  //       {category.title}
  //     </span>
  //   </div>
  // );

  return (
    <GameButton
      onClick={() => handleOnCategoryClick(category)} 
    >
      <span>{category.title}</span>
    </GameButton>
  )
}

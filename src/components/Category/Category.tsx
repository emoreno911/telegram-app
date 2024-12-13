"use client";
import { useMatch } from "@/contexts/MatchContext";
import { getSongs } from "../../app/helpers/functions";
import { categoryType } from "@/types/deezerApiTypes";
import { useRouter } from "next/navigation";

export default function Category(category: categoryType) {
  const { title } = category;

  const router = useRouter();
  const [state, dispatch] = useMatch();

  const handleOnCategoryClick = (newCategory: categoryType) => {
    dispatch({ type: "SET_CATEGORY", category: newCategory });
    (async () => {
      const { data } = await getSongs(
        newCategory,
        state?.numberOfSongs * state?.numberOfGuesses
      );
      dispatch({
        type: "SET_SONGS",
        songList: data?.sort(() => 0.5 - Math.random()),
      });
      router.push(`/music-game/round/${title}`);
    })();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={() => handleOnCategoryClick(category)}
    >
      {/* <category.icon className="w-12 h-12 mb-2 text-indigo-600" /> */}
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </div>
  );
}

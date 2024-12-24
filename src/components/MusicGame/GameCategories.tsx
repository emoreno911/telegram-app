import {
  IconMusic,
  IconGuitarPick,
  IconMicrophone,
  IconDisc,
  IconHeadphones,
  IconRadio,
} from "@tabler/icons-react";
import Link from "next/link";

const categories = [
  { name: "pop", icon: IconMusic },
  { name: "rock", icon: IconGuitarPick },
  { name: "jazz", icon: IconMicrophone },
  { name: "classical", icon: IconDisc },
  { name: "electronic", icon: IconHeadphones },
  { name: "radio", icon: IconRadio },
];

export default function GameCategories() {
  return (
    <div className="bg-sky-500 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Music Categories
      </h2>
      <div className="grid grid-cols-2 gap-4 px-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-transform duration-200 ease-in-out transform hover:scale-105"
          >
            <Link href={`/music-game/round/${category.name}`}>
              <category.icon className="w-12 h-12 mb-2 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

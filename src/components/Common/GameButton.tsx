import { PropsWithChildren } from "react";

export default function  GameButton (
  { children }: PropsWithChildren
) { 
  return (
    <button 
				type="button"
				//className="w-full  min-w-80 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
				className="game-button mb-2 min-w-80"
				onClick={() => {}}
			>
				<div className="flex justify-center gap-1 text-shadow-black">{ children }</div>
		</button>
  )
}
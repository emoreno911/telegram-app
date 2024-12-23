import { PropsWithChildren } from "react";

export default function  GameContainer (
	{ children }: PropsWithChildren
) { 
  return (
		// <div className="relative h-screen flex flex-col items-center justify-center gap-3 bg-music-notes">
		<div className="relative h-screen flex flex-col items-center justify-center gap-3 bg-music-notes">
			<div className="w-full h-full absolute top-0 left-0 z-0" style={{backgroundColor: "#10021de6"}}></div>
    	{ children }
    </div>
	)
}
import React from "react"

interface Props {
    genre: string
}
 
const GameRound:React.FC<Props> = ({genre}) => {
    return (
        <div className="bg-gray-100 min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
				Game Round {genre}
			</h1>
        </div>
    )
}

export default GameRound
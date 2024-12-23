import React from 'react'

interface Match {
  id: number
  score: number
  averageTime: string
  totalPoints: number
  date: string
}

interface MatchHistoryProps {
  matches: Match[]
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <div className="w-full text-white pt-6">
      <h2 className="text-2xl font-bold mb-4">Your Latest Matches</h2>
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.id} className="bg-sky-700/75 p-4 rounded-lg flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Date</span>
              <span className="font-medium">{match.date}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Score</span>
              <span className="font-medium">{match.score}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Avg Time</span>
              <span className="font-medium">{match.averageTime}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-400">Total Points</span>
              <span className="font-medium">{match.totalPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


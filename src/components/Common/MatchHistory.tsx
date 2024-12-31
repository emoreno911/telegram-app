import { getLastMatches } from '@/helpers/service'
import React, { useEffect, useState } from 'react'

interface Match {
  match_id: string
  cat_name: string
  avg_time: string
  points: number
  created_at: string
}

interface MatchHistoryProps {
  nftId: string
}

export default function MatchHistory({ nftId }: MatchHistoryProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loaderMessage, setLoaderMessage] = useState<string|null>(null);

  useEffect(() => {
    initMatchHistory()
  }, [])

  const initMatchHistory = async () => {
    setLoaderMessage("Getting data...");
    const response = await getLastMatches(nftId);
    setLoaderMessage(null);
    if (!response.error) {
      setMatches(response.data);
      //console.log(response)
    }
    else {
      console.log("error")
    }
  }

  const formatDate = (str: string) => {
    let date = new Date(str);
    //console.log(str)
    return date.toDateString()
  }

  return (
    <div className="w-full text-white pt-6">
      <h2 className="text-2xl font-bold mb-4">Your Latest Matches</h2>
      <div className="py-0">{loaderMessage}</div>
      { matches.length === 0 && !loaderMessage && (<div className="pb-4 text-gray-400">No matches found!</div>) }
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.match_id} className="bg-sky-700/75 p-4 rounded-lg flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">{match.cat_name}</span>
              <span className="font-medium">{formatDate(match.created_at)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Score</span>
              <span className="font-medium">{match.points}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Avg Time</span>
              <span className="font-medium">{match.avg_time}</span>
            </div>
            {/* <div className="flex flex-col items-end">
              <span className="text-sm text-gray-400">Date</span>
              <span className="font-medium">{formatDate(match.created_at)}</span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}


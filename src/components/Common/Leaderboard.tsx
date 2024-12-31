"use client"
import React, { useEffect, useState } from 'react'
import { IconHome, IconMedal, IconSquareRoundedArrowLeft, IconTrophy } from '@tabler/icons-react'
import { getLeaderboard } from "@/helpers/service";
import ScrollableContainer from './ScrollableContainer'
import Link from 'next/link'
import { useDapp } from '@/contexts/DappContext';


interface User {
  nft_id: string
  username: string
  total: number
  avg: number
  best: number
}

export default function Leaderboard() {
  const { profileToken } = useDapp();
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loaderMessage, setLoaderMessage] = useState<string|null>(null);

  useEffect(() => {
    initLeaderboard()
  }, [])

  const initLeaderboard = async () => {
    
    setLoaderMessage("Getting data...");
    const response = await getLeaderboard();
    setLoaderMessage(null);
    if (!response.error) {
      setTopUsers(response.data);
      //console.log(response)
    }
    else {
        console.log("error")
    }
  }

  return (
    <ScrollableContainer>
      <div className="flex justify-center items-center gap-2 mb-8">
        <Link href={`/`}>
          <button type="button">
            <IconSquareRoundedArrowLeft className="w-8 h-8" />
          </button>
        </Link>
        <h1 className="flex-grow text-3xl font-bold text-center text-sky-500 text-shadow-black">Leaderboard</h1>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-center rounded-lg bg-zinc-700 p-2 mb-6">
        <div className="font-semibold rounded-lg py-1" style={{backgroundColor:"#E91E63"}}>ALL TIME</div>
        <div className="font-semibold rounded-lg py-1">WEEKLY</div>
      </div>

      {/* Current User Card */}
      {profileToken !== null && (
        <div className="bg-gray-700 p-4 rounded-lg shadow mb-6 flex items-center justify-between" style={{backgroundColor:"#E91E63"}}>
          <div className="flex items-center space-x-4">
            <img src={"/GTB_logo_512.png"} alt={profileToken.username} className="w-12 h-12 rounded-full" style={{backgroundColor:"#ebebeb"}} />
            <div>
              <p className="font-semibold text-lg">{profileToken.username}</p>
              <p className="text-gray-400">You</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl">{profileToken.totalScore}</p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>
        </div>
      )}

      <div className="py-4">{loaderMessage}</div>

      {/* Top Users List */}
      <div className="space-y-1">
        {topUsers.map((user, index) => (
          <div key={user.nft_id} className={`p-4 rounded-lg shadow flex items-center justify-between ${index < 3 ? "bg-sky-700/75" : "bg-sky-500/75"}`}>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
              {index < 3 ? (
                <IconMedal className={`w-12 h-12 p-1 rounded-full ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-yellow-700'
                }`} />
              ) : (
                <img src={"/GTB_logo_512.png"} alt={user.username} className="w-12 h-12 rounded-full" />
              )}
              <p className="font-semibold">{user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-bold text-xl">{user.total}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollableContainer>
  )
}
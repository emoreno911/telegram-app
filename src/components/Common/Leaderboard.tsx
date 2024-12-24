import React from 'react'
import { IconMedal, IconTrophy } from '@tabler/icons-react'
import ScrollableContainer from './ScrollableContainer'

interface User {
  id: number
  name: string
  avatar: string
  points: number
}

interface LeaderboardProps {
  currentUser: User
  topUsers: User[]
}

export default function Leaderboard({ currentUser, topUsers }: LeaderboardProps) {
  const getUserRank = (user: User) => topUsers.findIndex((u) => u.id === user.id) + 1

  const currentUserRank = getUserRank(currentUser)

  return (
    <ScrollableContainer>
      <div className="flex flex-col items-center mb-8">
        <IconTrophy className="w-16 h-16 text-yellow-500 mb-2" />
        <h1 className="text-3xl font-bold font-gaming text-sky-500 text-shadow-black">Leaderboard</h1>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-center rounded-lg bg-zinc-700 p-2 mb-6">
        <div className="font-semibold rounded-lg py-1" style={{backgroundColor:"#E91E63"}}>ALL TIME</div>
        <div className="font-semibold rounded-lg py-1">WEEKLY</div>
      </div>

      {/* Current User Card */}
      <div className="bg-gray-700 p-4 rounded-lg shadow mb-6 flex items-center justify-between" style={{backgroundColor:"#E91E63"}}>
        <div className="flex items-center space-x-4">
          <img src={"/GTB_logo_512.png"} alt={currentUser.name} className="w-12 h-12 rounded-full" style={{backgroundColor:"#ebebeb"}} />
          <div>
            <p className="font-semibold text-lg">{currentUser.name}</p>
            <p className="text-gray-400">You</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl">{currentUser.points}</p>
          <p className="text-sm text-gray-400">Rank #{currentUserRank}</p>
        </div>
      </div>

      {/* Top Users List */}
      <div className="space-y-1">
        {topUsers.map((user, index) => (
          <div key={user.id} className={`p-4 rounded-lg shadow flex items-center justify-between ${index < 3 ? "bg-sky-700/75" : "bg-sky-500/75"}`}>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
              {index < 3 ? (
                <IconMedal className={`w-12 h-12 p-1 rounded-full ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-yellow-700'
                }`} />
              ) : (
                <img src={"/GTB_logo_512.png"} alt={user.name} className="w-12 h-12 rounded-full" />
              )}
              <p className="font-semibold">{user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-bold text-xl">{user.points}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollableContainer>
  )
}
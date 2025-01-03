"use client"

import { IconClock, IconHome, IconSquareRoundedArrowLeft, IconStar, IconTrophy } from "@tabler/icons-react"
import ScrollableContainer from "./ScrollableContainer"
import MatchHistory from "./MatchHistory"
import Link from "next/link"
import { useDapp } from "@/contexts/DappContext"
import { CONTRACT_ADDRESS } from "@/constants"

interface ProfileCardProps {
  avatarUrl: string
  username: string
  topScore: number
  totalPoints: number
  averageTime: number
}

function GameProfileCard({
  avatarUrl,
  username,
  topScore,
  totalPoints,
  averageTime
}: ProfileCardProps) {
  return (
    <div className="z-10 w-80 sm:w-96 mx-auto text-white px-0 py-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 border-4 border-pink-500 shadow-pink-500/50 shadow-lg rounded-full">
          <img src={avatarUrl} alt={username} />
          {/* <h3>{username.slice(0, 2).toUpperCase()}</h3> */}
        </div>
        <div className="w-full flex flex-col items-center space-y-4">
					<h2 className="text-3xl font-bold text-pink-500">{username}</h2>
					<div className="w-full grid grid-cols-3 gap-4 text-center">
						<div className="flex flex-col items-center space-y-2 group">
							<IconTrophy className="w-8 h-8 sm:w-14 sm:h-14 text-yellow-400 group-hover:animate-bounce" />
							<span className="text-sm text-gray-400">Top Score</span>
							<span className="text-3xl font-semibold">{topScore}</span>
						</div>
						<div className="flex flex-col items-center space-y-2 group">
							<IconStar className="w-8 h-8 sm:w-14 sm:h-14 text-blue-400 group-hover:animate-spin" />
							<span className="text-sm text-gray-400">Total Points</span>
							<span className="text-3xl font-semibold">{totalPoints}</span>
						</div>
						<div className="flex flex-col items-center space-y-2 group">
							<IconClock className="w-8 h-8 sm:w-14 sm:h-14 text-green-400 group-hover:animate-pulse" />
							<span className="text-sm text-gray-400">Avg Time</span>
							<span className="text-3xl font-semibold">{averageTime}</span>
						</div>
					</div>
				</div>
      </div>
    </div>
  )
}

export default function UserProfile() {
  const { profileToken, profileImage } = useDapp();

  if (profileToken === null) {
    return (<div className="z-10">
      <p className="text-3xl font-bold text-sky-500 text-shadow-black text-center mt-2">Please connect your wallet to show your profile</p>
      <Link href="/">
        <button
          className="mx-auto bg-slate-100 text-gray-800 flex items-center justify-center text-center text-lg font-bold uppercase rounded-lg py-4 px-6 mt-4"
        >
          Back to Home
        </button>
      </Link>
    </div>)
  }

  return (
    <ScrollableContainer>
      <div className="flex justify-center items-center gap-2 mb-8">
        <Link href={`/`}>
          <button type="button">
            <IconSquareRoundedArrowLeft className="w-8 h-8" />
          </button>
        </Link>
        <h1 className="flex-grow text-3xl font-bold text-center text-sky-500 text-shadow-black">Your Profile</h1>
      </div>

      <div className="flex flex-col items-center justify-center my-5 box-shadow-black">
        <div className="p-3 rounded-md bg-slate-100 text-gray-800">
        <img src={profileImage as string} className="w-80 h-80 rounded-md" alt={"nft profile"}/>
        <h3 className="text-center text-xl font-bold pt-4">{`${profileToken.symbol} #${profileToken.id}`}</h3>
        <h3 className="text-center text-gray-500 pb-4">{"Guess The Beat Profiles"}</h3>
        </div>
      </div>

      {profileToken !== null && (
        <div className="flex items-center justify-center">
          <a href={`https://opbnb.bscscan.com/nft/${CONTRACT_ADDRESS}/${profileToken.id}`} target="_blank">
            <div className="z-10 text-white mb-4 px-4 py-1 bg-sky-600 text-sm rounded-md flex items-center gap-1 box-shadow-custom">
              <img 
                src="https://opbnb.bscscan.com/assets/opbnb/images/svg/logos/token-light.svg"
                className="h-4 w-4"
                alt="opBNB symbol"
              />
              <span>{"Check in Explorer"}</span>
            </div>
          </a>
        </div>
      )}

      {profileToken !== null && (
        <MatchHistory nftId={profileToken.nftId} />
      )}
    </ScrollableContainer>
  )
}


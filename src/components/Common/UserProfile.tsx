import { IconClock, IconStar, IconTrophy } from "@tabler/icons-react"
import ScrollableContainer from "./ScrollableContainer"
import MatchHistory from "./MatchHistory"

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

const matchHistory = [
  { id: 1, score: 850, averageTime: "1:45", totalPoints: 12000, date: "2023-06-01" },
  { id: 2, score: 920, averageTime: "1:30", totalPoints: 13500, date: "2023-06-02" },
  { id: 3, score: 780, averageTime: "1:55", totalPoints: 11000, date: "2023-06-03" },
  { id: 4, score: 1050, averageTime: "1:20", totalPoints: 15000, date: "2023-06-04" },
  { id: 5, score: 890, averageTime: "1:40", totalPoints: 12500, date: "2023-06-05" },
  { id: 6, score: 960, averageTime: "1:35", totalPoints: 14000, date: "2023-06-06" },
  { id: 7, score: 820, averageTime: "1:50", totalPoints: 11500, date: "2023-06-07" },
  { id: 8, score: 1100, averageTime: "1:15", totalPoints: 16000, date: "2023-06-08" },
  { id: 9, score: 930, averageTime: "1:25", totalPoints: 13000, date: "2023-06-09" },
  { id: 10, score: 1000, averageTime: "1:30", totalPoints: 14500, date: "2023-06-10" },
]

export default function UserProfile() {
    return (
			<ScrollableContainer>
					<GameProfileCard 
						avatarUrl="https://avatar.iran.liara.run/public/girl"
						username="PandoraRomanov"
						topScore={15}
						totalPoints={120}
						averageTime={4.5}
					/>

					{/* Latest scores */}
					<MatchHistory matches={matchHistory} />
			</ScrollableContainer>
    )
}


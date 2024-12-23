import { Page } from "@/components/Page";
import GameContainer from "@/components/Common/GameContainer";
import Leaderboard from "@/components/Common/Leaderboard";

const currentUser = {
  id: 5,
  name: "Current Player",
  avatar: "/placeholder.svg?height=48&width=48",
  points: 8500
}

const topUsers = [
  { id: 1, name: "John Doe", avatar: "/placeholder.svg?height=48&width=48", points: 10000 },
  { id: 2, name: "Jane Smith", avatar: "/placeholder.svg?height=48&width=48", points: 9800 },
  { id: 3, name: "Bob Johnson", avatar: "/placeholder.svg?height=48&width=48", points: 9600 },
  { id: 4, name: "Alice Brown", avatar: "/placeholder.svg?height=48&width=48", points: 9400 },
  { id: 5, name: "Current Player", avatar: "/placeholder.svg?height=48&width=48", points: 8500 },
  { id: 6, name: "Eva Green", avatar: "/placeholder.svg?height=48&width=48", points: 8200 },
  { id: 7, name: "Mike Wilson", avatar: "/placeholder.svg?height=48&width=48", points: 8000 },
  { id: 8, name: "Sarah Lee", avatar: "/placeholder.svg?height=48&width=48", points: 7800 },
  { id: 9, name: "Tom Davis", avatar: "/placeholder.svg?height=48&width=48", points: 7600 },
  { id: 10, name: "Emma White", avatar: "/placeholder.svg?height=48&width=48", points: 7400 },
]

export default function LeaderboardPage() {
  return (
    <Page>
			<GameContainer>
				<Leaderboard currentUser={currentUser} topUsers={topUsers} />
			</GameContainer>
    </Page>
  );
}
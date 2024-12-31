import { Page } from "@/components/Page";
import GameContainer from "@/components/Common/GameContainer";
import Leaderboard from "@/components/Common/Leaderboard";


export default function LeaderboardPage() {
  return (
    <Page back={true}>
			<GameContainer>
				<Leaderboard />
			</GameContainer>
    </Page>
  );
}
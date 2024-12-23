import { Page } from "@/components/Page";
import GameContainer from "@/components/Common/GameContainer";
import UserProfile from "@/components/Common/UserProfile";

export default function UserProfilePage() {
  return (
    <Page>
			<GameContainer>
				<UserProfile />
			</GameContainer>
    </Page>
  );
}
import { Page } from "@/components/Page";
import CategoryList from "@/components/CategoryList/CategoryList";
import GameContainer from "@/components/Common/GameContainer";

export default function MusicGamePage() {
  return (
    <Page>
      <GameContainer>
        <CategoryList />
      </GameContainer>
    </Page>
  );
}
